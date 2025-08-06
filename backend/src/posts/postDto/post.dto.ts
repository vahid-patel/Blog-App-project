// src/blog/dto/create-blog-post.dto.ts
import { Types } from 'mongoose';
import { IsNotEmpty, IsString, IsEnum, IsMongoId, MinLength, MaxLength } from 'class-validator';
import { categories } from '../schemas/post.schema';

export class CreateBlogPostDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(150)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  content: string;

  @IsNotEmpty()
  @IsEnum(categories, {message : 'Invalid Category'})
  category: categories;

  @IsMongoId()
  @IsNotEmpty()
  authorId: Types.ObjectId;
}
