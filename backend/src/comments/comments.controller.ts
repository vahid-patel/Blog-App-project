import { Controller, Post, Body, Req, Param, UseGuards, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { commentDto } from './commentDto/comment.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create/:postId')
  async createComment(@Param('postId') postId : string ,@Body() CommentData : commentDto, @Req() req){
    return this.commentsService.commentcreate(postId ,CommentData, req.user.userId)
  }

  @Get('posts/:postId')
  async getAllComments(@Param('postId') postId : Types.ObjectId){
    return this.commentsService.getAllCommentsofPost(postId)
  }
  
}
