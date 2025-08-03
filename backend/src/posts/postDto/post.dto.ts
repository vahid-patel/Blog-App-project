// src/blog/dto/create-blog-post.dto.ts

import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateBlogPostDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString({ each: true })
  category?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string;

  @IsOptional()
  @IsString()
  status?: 'Draft' | 'Published';
}
