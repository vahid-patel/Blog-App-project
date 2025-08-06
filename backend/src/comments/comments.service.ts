import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './commentSchema/comment.schema';
import { Model, Types } from 'mongoose';
import { commentDto } from './commentDto/comment.dto';

@Injectable()
export class CommentsService {
    constructor (@InjectModel(Comment.name) private commentModel : Model<CommentDocument>){}

    async commentcreate(postId : Types.ObjectId , CommentData : commentDto, userId){
        const newComment = new this.commentModel({
            ...CommentData,
            postId : new Types.ObjectId(postId),
            userId : new Types.ObjectId(userId)
        })

        return await newComment.save()
    }
}
