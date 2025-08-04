import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class updateDto{
    
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    password : string
}