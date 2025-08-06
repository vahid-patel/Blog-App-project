import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, commentSchema } from './commentSchema/comment.schema';

@Module({
  imports :[
    MongooseModule.forFeature([{name : Comment.name, schema : commentSchema}])
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
