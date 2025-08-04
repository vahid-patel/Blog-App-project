import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './authDto/signup.dto';
import { loginDto } from './authDto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupData:signupDto ) {
    return this.authService.signUp(signupData);
  }

  @Post('login')
  login(@Body() loginData : loginDto) {
    return this.authService.login(loginData);
  }
  
}
