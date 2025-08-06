import { IsNotEmpty, IsString } from "class-validator";

export class commentDto {
    @IsString()
    @IsNotEmpty()
    content : string
}