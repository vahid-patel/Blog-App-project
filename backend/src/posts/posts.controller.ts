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
  Query,
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

  @Get('search')
  async searchPost(@Query('q') query : string, @Query('page') page : string = '1', @Query('limit') limit : string = '5'){
    const Page = parseInt(page)
    const Limit = parseInt(limit)

    return this.postsService.searchPosts(query,Page, Limit)
  }

  @Get()
  async getAllPosts(@Query('page') page : string = '1', @Query('limit') limit : string = '5') {

    const Page = parseInt(page)
    const Limit = parseInt(limit)
    return this.postsService.getAllPosts(Page, Limit);
  }

  @Get(':postId')
  async getPostbyId(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':postId')
  async updatePost(
    @Param('postId') postId: string,
    @Body() updateData: updatePostDto,
    @Req() req,
  ) {
    return this.postsService.updatePost(postId, updateData, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId')
  async deletePost(@Param('postId') postId: string, @Req() req) {
    return this.postsService.deletePost(postId, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId/like')
  async likePost(@Param('postId') postId: string, @Req() req) {
    return this.postsService.likePost(postId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':postId/dislike')
  async dislikePost(@Param('postId') postId: string, @Req() req) {
    
    return this.postsService.dislikePost(postId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId/like')
  async removeLike(@Param('postId') postId: string, @Req() req) {
    return this.postsService.removeLike(postId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':postId/dislike')
  async removeDislike(@Param('postId') postId: string, @Req() req) {
    return this.postsService.removeDislike(postId, req.user.userId);
  }
}
