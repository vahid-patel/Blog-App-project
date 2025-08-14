import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer'


@Injectable()
export class MailerService {
    private transporter

    constructor(private configService : ConfigService){
        this.transporter = nodemailer.createTransport({
            host : this.configService.get<string>('Brevo.BREVO_HOST'),
            port : parseInt(this.configService.get<string>('Brevo.BREVO_PORT')!),
            secure : false,
            auth : {
                user : this.configService.get<string>('Brevo.BREVO_USER'),
                pass : this.configService.get<string>('Brevo.BREVO_PASS')
            }
        })
    }

    async sendOtpToEmail(to : string , otp : string){
        await this.transporter.sendMail({
            from : this.configService.get<string>('Brevo.BREVO_USER'),
            to,
            Subject : 'Your OTP Code',
            text : `Your OTP code is ${otp}. It Expires in 10 Minutes.`
        })
    }
}