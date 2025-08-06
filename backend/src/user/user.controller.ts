import { Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { signupDto } from 'src/auth/authDto/signup.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from './userSchema/User.schema';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getUsers(@Req() req : Request) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  updateUser(@Body() updateData : signupDto, @Req() req : Request ){
    return this.userService.updateUser(updateData,req)
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('all')
  getAllUsers(){
    return this.userService.findAll()
  }

  @UseGuards(AuthGuard('jwt'),RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete('delete/:id')
  deleteUser(@Param('id') id : string){
    return this.userService.removeUser(id)
  }
  
}
