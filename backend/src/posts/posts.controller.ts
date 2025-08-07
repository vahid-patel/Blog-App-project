import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateBlogPostDto } from './postDto/post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { updatePostDto } from './postDto/updatePost.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() postData: CreateBlogPostDto, @Req() req) {
    return this.postsService.createPost(postData, req.user.userId);
  }

  @Get()
  async getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':postId')
  async getPostbyId(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    updateData: updatePostDto,
    @Req() req,
  ) {
    return this.postsService.updatePost(postId, updateData, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string, @Req() req) {
    return this.postsService.deletePost(postId, req.user);
  }
}
