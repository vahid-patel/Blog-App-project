import { Injectable } from '@nestjs/common';
import { CreateBlogPostDto } from './postDto/post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class PostsService {

  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}


  async createPost(postData: CreateBlogPostDto, userId): Promise<Post> {
    
    const newPost = new this.postModel({
      ...postData,
      author : new Types.ObjectId(userId)
    });
    
    return await newPost.save();
  }

  
}
