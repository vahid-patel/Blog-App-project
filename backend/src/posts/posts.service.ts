import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
import { CreateBlogPostDto } from './postDto/post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './schemas/post.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}
  async createPost(postDto: CreateBlogPostDto): Promise<Post> {
    const newPost = new this.postModel(postDto);
    console.log(newPost);
    return await newPost.save();
  }

  async getPosts() {
    return await this.postModel.find({ status: 'Published' });
  }
}
