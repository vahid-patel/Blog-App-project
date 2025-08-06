// src/post/schemas/post.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

export enum categories {
  FOOD = 'FOOD',
  TRAVEL = 'TRAVEL',
  HEALTH_AND_FITNESS = 'HEALTH & FITNESS',
  LIFESTYLE = 'LIFESTYLE',
  FASHION = 'FASHION',
  BEAUTY = 'BEAUTY',
  PERSONAL_FINANCE = 'PERSONAL FINANCE',
  TECHNOLOGY = 'TECHNOLOGY',
  DIY_AND_CRAFT = 'DIY AND CRAFT',
  PARENTING = 'PARENTING',
  MUSIC = 'MUSIC',
  ARTIFICIAL_INTELLIGENCE = 'ARTIFICIAL INTELLIGENCE',
  FINANCE = 'FINANCE',
  GEOPOLITICS = 'GEOPOLITICS',
  SPORTS = 'SPORTS',
  CASE_STUDIES = 'CASE STUDIES',
  BUSINESS = 'BUSINESS',
  EDUCATION = 'EDUCATION',
  GENERAL = 'GENERAL',
}

@Schema({ timestamps: true }) 
export class Post {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: String,
    required: true,
    enum: categories,
    default: categories.GENERAL,
  })
  category: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  author: Types.ObjectId;

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

export const PostSchema = SchemaFactory.createForClass(Post);
