import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateBlogPostDto } from './postDto/post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() postDto: CreateBlogPostDto) {
    console.log(postDto);
    return this.postsService.createPost(postDto);
  }

  @Get()
  async getPosts() {
    return this.postsService.getPosts();
  }
}
