import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './userSchema/User.schema';
import { Model } from 'mongoose';
import { updateDto } from './userDto/update.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).select('-password').exec(); // hide password
  }

  async findAll(){
    return this.userModel.find().select('-password')
  }

  async updateUser(updateData : updateDto, req){
    const {name , password} = updateData
    const {userId} = req.user
    const user = await this.userModel.findById(userId)

    if(!user){
      throw new BadRequestException('User does not exist')
    }

    if(name){
      user.name = name
    }

    if(password){
      const hashedPassword = await bcrypt.hash(password,10)
      user.password = hashedPassword
    }

    await user.save()

    return {
      message : 'User Updated Succesfully',
      updatedUser:{
        name : user.name,
        email : user.email
      }
    }

  }

  removeUser(id:string){
    return this.userModel.findByIdAndDelete(id)
  }
}
