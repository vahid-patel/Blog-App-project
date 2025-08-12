import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class loginDto{
    
    @ApiProperty({ example: 'john@example.com', description: 'Email address' })
    @IsNotEmpty()
    @IsEmail()
    email : string

    @ApiProperty({ example: 'Strong@Password123', description: 'User password' })
    @IsNotEmpty()
    @IsString()
    password : string

}