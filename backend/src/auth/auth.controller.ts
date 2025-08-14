import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, VerifyOtpDto } from './authDto/signup.dto';
import { loginDto } from './authDto/login.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiResponse({ status: 201, description: 'User signed up successfully.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Validation failed.' })
  signup(@Body() signupData: SignupDto) {
    return this.authService.signUp(signupData);
  }

  @Post('login')
  @ApiResponse({ status: 201, description: 'User logged in successfully and token created' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginData: loginDto) {
    return this.authService.login(loginData);
  }

  @Post('verify-otp')
  verifyOTP(@Body() verifyOtpDto : VerifyOtpDto){
    return this.authService.verifyOtp(verifyOtpDto)
  }
}
