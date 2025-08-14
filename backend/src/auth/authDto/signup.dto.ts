import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { UserRole } from 'src/user/userSchema/User.schema';

export class SignupDto {

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'john@example.com', description: 'Email address' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Strong@Password123', description: 'User password' })
  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

export class VerifyOtpDto {
  @IsEmail()
  email : string

  @IsNotEmpty()
  otp : string
}
