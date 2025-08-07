import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { CommentsModule } from 'src/comments/comments.module';
import { Comment, commentSchema } from 'src/comments/commentSchema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }, { name: Comment.name, schema: commentSchema }]),
    CommentsModule
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
