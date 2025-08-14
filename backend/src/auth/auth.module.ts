import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { MailerService } from 'src/common/mailer/mail.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,MailerService],
})
export class AuthModule {}
