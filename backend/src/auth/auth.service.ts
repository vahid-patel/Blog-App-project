import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/userSchema/User.schema';
import * as bcrypt from 'bcrypt';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, name, password: hashedPassword });
    return user.save();
  }

  async login(email: string, password: string) {
    const isUserPresent = await this.userModel.findOne({ email });
    console.log(isUserPresent);
    if (!isUserPresent) return null;
    // console.log(isUserPresent.password);
    // console.log(password);
    const isMatch = await bcrypt.compare(password, isUserPresent.password);
    if (!isMatch) return 'error';

    const payload = { email: isUserPresent.email, sub: isUserPresent._id };
    const token = this.jwtService.sign(payload);
    console.log('hello');
    console.log(token);

    return {
      access_token: token,
    };
  }
}
