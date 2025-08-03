import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/userSchema/User.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, name: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({ email, name, hashedPassword });
    return user.save();
  }

  async login(email: string, password: string) {
    const isUserPresent = await this.userModel.findOne({ email });
    if (!isUserPresent) return null;

    const isMatch = await bcrypt.compare(isUserPresent.password, password);
    if (!isMatch) return null;

    const payload = { email: isUserPresent.email, sub: isUserPresent._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
