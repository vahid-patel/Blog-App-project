import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './commentSchema/comment.schema';
import { Model, Types } from 'mongoose';
import { commentDto } from './commentDto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async commentcreate(postId: string, CommentData: commentDto, userId: string) {
    const newComment = new this.commentModel({
      ...CommentData,
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
    });

    return await newComment.save();
  }

  async getAllCommentsofPost(postId: string) {
    return await this.commentModel
      .find({ postId: new Types.ObjectId(postId) })
      .populate('userId', 'name email');
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.commentModel.findById(commentId);

    if (!comment) {
      throw new NotFoundException('comment not found');
    }

    if (comment.userId.toString() !== userId) {
      throw new UnauthorizedException('not authorized to delete a comment');
    }

    this.commentModel.findByIdAndDelete(commentId);
    return {message : 'Comment deleted'}
  }

  async likeComment(commentId: string, userId: string) {
    await this.commentModel.updateOne(
      { _id: commentId },
      {
        $addToSet: { likes: new Types.ObjectId(userId) },
        $pull: { dislikes: new Types.ObjectId(userId) },
      },
    );
  }

  async disLikeComment(commentId: string, userId: string) {
    await this.commentModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      {
        $addToSet: { dislikes: new Types.ObjectId(userId) },
        $pull: { likes: new Types.ObjectId(userId) },
      },
    );
  }

  async removeLike(commentId: string, userId: string) {
    await this.commentModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      {
        $pull: { likes: new Types.ObjectId(userId) },
      },
    );
  }

  async removeDislike(commentId: string, userId: string) {
    await this.commentModel.updateOne(
      { _id: new Types.ObjectId(commentId) },
      {
        $pull: { dislikes: new Types.ObjectId(userId) },
      },
    );
  }
}
