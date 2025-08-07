import { IsNotEmpty, IsString, MaxLength, MinLength, IsEnum } from "class-validator";
import { categories } from "../schemas/post.schema";

export class updatePostDto{
    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(150)
    title : string

    @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

   @IsNotEmpty()
    @IsEnum(categories, {message : 'Invalid Category'})
    category: categories;


}