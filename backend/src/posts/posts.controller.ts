import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateBlogPostDto } from './postDto/post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() postData: CreateBlogPostDto , @Req() req) {
    
    return this.postsService.createPost(postData, req.user.userId);
  }

  
}
