import {
  Controller,
  Post,
  Body,
  Req,
  Param,
  UseGuards,
  Get,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { commentDto } from './commentDto/comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create/:postId')
  async createComment(
    @Param('postId') postId: string,
    @Body() CommentData: commentDto,
    @Req() req,
  ) {
    return this.commentsService.commentcreate(
      postId,
      CommentData,
      req.user.userId,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('posts/:postId')
  async getAllComments(@Param('postId') postId: string) {
    return this.commentsService.getAllCommentsofPost(postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:commentId')
  async deleteComment(@Param('commentId') commentId: string, @Req() req) {
    return this.commentsService.deleteComment(commentId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':commentId/like')
  async likeComment(@Param('commentId') commentId: string, @Req() req) {
    return this.commentsService.likeComment(commentId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':commentId/dislike')
  async disLikeComment(@Param('commentId') commentId: string, @Req() req) {
    return this.commentsService.disLikeComment(commentId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId/like')
  async removeLike(@Param('commentId') commentId: string, @Req() req) {
    return this.commentsService.removeLike(commentId, req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':commentId/dislike')
  async removeDislike(@Param('commentId') commentId: string, @Req() req) {
    return this.commentsService.removeDislike(commentId, req.user.userId);
  }
}
