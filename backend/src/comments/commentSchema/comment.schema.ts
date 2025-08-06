import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export type CommentDocument = Comment & Document

@Schema({timestamps : true})
export class Comment {
    @Prop({
        type : Types.ObjectId,
        ref : 'Post',
        required : true
    })
    postId : Types.ObjectId

    @Prop({
        type: Types.ObjectId,
        ref : 'User',
        required : true
    })
    userId : Types.ObjectId

    @Prop({required : true})
    content : string

    @Prop({
        type : [Types.ObjectId],
        ref : 'User',
        default : []
    })
    likes : Types.ObjectId[]

    @Prop({
        type : [Types.ObjectId],
        ref : 'User',
        default : []
    })
    dislikes : Types.ObjectId[]
}

export const commentSchema = SchemaFactory.createForClass(Comment)