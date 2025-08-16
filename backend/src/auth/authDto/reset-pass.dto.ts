import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ResetpassDto{
    @IsNotEmpty()
    @IsString()
    userId : string

    @IsNotEmpty()
    @IsString()
    token : string

    @IsNotEmpty()
    @IsString()
    @IsStrongPassword()
    newPassword : string
}