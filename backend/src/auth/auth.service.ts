import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/userSchema/User.schema';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './authDto/signup.dto';
import { loginDto } from './authDto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupDto : SignupDto) {
    const {email, password, name, role} = signupDto

    const isUser = await this.userModel.findOne({email})

    if(isUser){
      throw new BadRequestException('User Already Exist')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userModel.create({
      name : name,
      email : email,
      password : hashedPassword,
      role : role
    })
    return newUser
  }
  // success, data, status code, message, error
  async login(loginData : loginDto) {

    const {email, password} = loginData
    
    const isUserPresent = await this.userModel.findOne({ email });
    
    if (!isUserPresent) {
      throw new UnauthorizedException('Wrong Credentials')
    }
    
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
}
