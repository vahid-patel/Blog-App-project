import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/userSchema/User.schema';
import * as bcrypt from 'bcrypt';
import { signupDto } from './authDto/signup.dto';
import { loginDto } from './authDto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(signupData : signupDto) {
    const {email, password, name, role} = signupData

    const isUser = await this.userModel.findOne({email})

    if(isUser){
      throw new BadRequestException('User Already Exist')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userModel.create({
      name : name,
      email : email,
      password : hashedPassword,
      role : role
    })
    return 'Created'
  }

  async login(loginData : loginDto) {

    const {email, password} = loginData
    
    const isUserPresent = await this.userModel.findOne({ email });
    console.log(isUserPresent);
    if (!isUserPresent) return null;
    // console.log(isUserPresent.password);
    // console.log(password);
    const isMatch = await bcrypt.compare(password, isUserPresent.password);
    if (!isMatch) return null;

    const payload = { 
      email: isUserPresent.email,
      userId: isUserPresent._id 
    };

    const token = this.jwtService.sign(payload);
    
    console.log(token);

    return {
      access_token: token,
    };
  }
}
