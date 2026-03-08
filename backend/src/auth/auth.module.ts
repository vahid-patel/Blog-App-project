import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { MailerService } from '../common/mailer/mail.service';
import { ConfigModule } from '@nestjs/config';
import { RedisProvider } from '../redis/redis.provider';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    UserModule,ConfigModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy,MailerService,RedisProvider,RedisModule],
})
export class AuthModule {}
