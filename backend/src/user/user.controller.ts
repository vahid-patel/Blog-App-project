import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { signupDto } from 'src/auth/authDto/signup.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getUsers(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update')
  updateUser(@Body() updateData : signupDto, @Req() req){
    return this.userService.updateUser(updateData,req)
  }
  
}
