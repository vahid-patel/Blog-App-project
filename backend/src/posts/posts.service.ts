import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateBlogPostDto } from './postDto/post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model, Types } from 'mongoose';
import { updatePostDto } from './postDto/updatePost.dto';
import {
  Comment,
  CommentDocument,
} from 'src/comments/commentSchema/comment.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createPost(postData: CreateBlogPostDto, userId: string): Promise<Post> {
    const newPost = new this.postModel({
      ...postData,
      author: new Types.ObjectId(userId),
    });

    return await newPost.save();
  }

  async getAllPosts() {
    return await this.postModel.find().populate('author', 'name email');
  }

  async getPostById(postId: string) {
    return await this.postModel.findById(postId);
  }

  async updatePost(postId: string, updateData: updatePostDto, userId: string) {
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    if (post.author.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    post.set(updateData);

    return await post.save();
  }

  async deletePost(postId: string, user: { userId: string; role: string }) {
    const post = await this.postModel.findById(postId);
    if (!post) throw new NotFoundException('Post not found');

    const isAuthor = post.author.toString() === user.userId;
    const isAdmin = user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    await this.postModel.findByIdAndDelete(postId);

    await this.commentModel.deleteMany({ postId: postId })

    return { message: 'Post deleted successfully' };
  }
}
