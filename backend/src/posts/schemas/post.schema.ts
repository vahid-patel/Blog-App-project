// src/post/schemas/post.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true }) // adds createdAt and updatedAt
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  category: string;

  @Prop()
  tags: string;

  @Prop({ default: 'Draft', enum: ['Draft', 'Published'] })
  status: 'Draft' | 'Published';

  @Prop({ required: true })
  authorId: string; // or use ObjectId if you want relation
}

export const PostSchema = SchemaFactory.createForClass(Post);
