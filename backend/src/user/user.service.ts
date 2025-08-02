import { Inject, Injectable } from '@nestjs/common';
import { UserDto } from './userDto/user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/Schemas/User.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  getUsers() {
    return this.userModel.find();
  }

  createUser(userDto: UserDto) {
    return this.userModel.create(userDto);
  }
}
