import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/userSchema/User.schema';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'
import { SignupDto, VerifyOtpDto } from './authDto/signup.dto';
import { ForgotPassDto, loginDto } from './authDto/login.dto';
import { generateOtp } from 'src/common/utils/otp.util';
import { MailerService } from 'src/common/mailer/mail.service';
import { ResetpassDto } from './authDto/reset-pass.dto';

@Injectable()
export class AuthService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient : any,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService, private mailerService : MailerService
  ) {}

  async signUp(signupDto : SignupDto) {
    const {email, password, name, role} = signupDto

    const isUser = await this.userModel.findOne({email})

    if(isUser){
      throw new BadRequestException('User Already Exist')
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

    const newUser = await this.userModel.create({
      name : name,
      email : email,
      password : hashedPassword,
      role : role,
      verified : false,
      otp,
      otpExpires
    })

    await this.mailerService.sendOtpToEmail(email, otp)
    return {Message : 'User registered. Please check your email for OTP'}
  }

  async verifyOtp(verifyOtpDto : VerifyOtpDto){
    const {email, otp} = verifyOtpDto
    
    const user = await this.userModel.findOne({email})

    if(!user) throw new BadRequestException('User not Found')
    if(user.verified) throw new BadRequestException('Already Verified')
    if(user.otp !== otp) throw new BadRequestException('Invalid OTP')
    if(user.otpExpires < new Date()) throw new BadRequestException('OTP Expired')

    user.verified = true
    await this.userModel.updateOne(
      {email},
      {
        $unset : {otp : '', otpExpires : ''}
      }
    )
    
    await user.save()
    return {message : 'Email Verified Successfully'}
  }
  // success, data, status code, message, error
  async login(loginData : loginDto) {

    const {email, password} = loginData
    
    const isUserPresent = await this.userModel.findOne({ email });
    
    if (!isUserPresent) {
      throw new UnauthorizedException('Wrong Credentials')
    }

    if(!isUserPresent.verified) throw new UnauthorizedException('Please verify your email first')
    
    const isMatch =  await bcrypt.compare(password, isUserPresent.password);

    if (!isMatch) {
      throw new UnauthorizedException('Wrong Credentials')
    };

    const payload = { 
      userId: isUserPresent._id ,
    };

    const token =  this.jwtService.sign(payload, {expiresIn : '24h'});
    
    console.log(token);
    return {
      token: token,
    };
  }

  async forgotPass(forgotPassDto : ForgotPassDto){
    const {email} = forgotPassDto
    const user = await this.userModel.findOne({email})
    if(!user) throw new NotFoundException('User not Exist')
    
    const token = crypto.randomBytes(32).toString('hex')

    await this.redisClient.set(`resetToken:${user._id}`, token, 'EX', 900)

    const resetLink = `http://localhost:3000/reset-password?token=${token}&userId=${user._id}`

    await this.mailerService.sendLinkToEmail(email,resetLink)

    return { message: 'Password reset link sent to email' };
    
  }

  async resetPass(resetPassDto : ResetpassDto){
    const {userId, token, newPassword} = resetPassDto

    const storedToken = await this.redisClient.get(`resetToken:${userId}`)

    if(!storedToken) throw new BadRequestException('Invalid or Token Expired')

    if(storedToken !== token) throw new BadRequestException("invalid token")

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await this.userModel.findByIdAndUpdate(userId,{password : hashedPassword})

    await this.redisClient.del(`resetToken:${userId}`)

    return { message: 'Password reset successful' }

  }
}
