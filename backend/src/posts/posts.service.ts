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

  async searchPosts(keyword : string){

    if(!keyword || keyword.trim() == ''){
      return {message : 'No results'}
    }

    return this.postModel.find(
      {$text : {$search : keyword } },
      {score : {$meta : 'textScore' } }
    ).sort({ score : { $meta : 'textScore' } }).exec()
  }

  async getAllPosts() {
    return await this.postModel.find().populate('author', 'name email');
  }

  async getPostById(postId: string) {
    return await this.postModel.findById(postId).populate('author', 'name email');
  }

  async updatePost(postId: string, updateData: updatePostDto, userId: string) {
    const {title, content, category}= updateData
    const post = await this.postModel.findById(postId);

    if (!post) {
      throw new NotFoundException('post not found');
    }

    if (post.author.toString() !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }

    if (title) {
      post.title = title;
    }
    if (content) {
      post.content = content;
    }
    if (category) {
      post.category = category;
    }   

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

    await this.commentModel.deleteMany({ postId: postId });

    return { message: 'Post deleted successfully' };
  }

  async likePost(postId: string, userId: string): Promise<any> {
    
    return await this.postModel.updateOne(
      { _id: postId },
      {
        $addToSet: { likes: new Types.ObjectId(userId) },
        $pull: { dislikes: new Types.ObjectId(userId) },
      },
    );
  }

  async dislikePost(postId: string, userId: string): Promise<any> {
    return await this.postModel.updateOne(
      { _id: new Types.ObjectId(postId) },
      {
        $addToSet: { dislikes: new Types.ObjectId(userId) },
        $pull: { likes: new Types.ObjectId(userId) },
      },
    );
  }

  async removeLike(postId: string, userId: string): Promise<any> {
    return await this.postModel.updateOne(
      { _id: new Types.ObjectId(postId) },
      {
        $pull: { likes: new Types.ObjectId(userId) },
      },
    );
  }

  async removeDislike(postId: string, userId: string): Promise<any> {
    return await this.postModel.updateOne(
      { _id: new Types.ObjectId(postId) },
      {
        $pull: { dislikes: new Types.ObjectId(userId) },
      },
    );
  }
}
