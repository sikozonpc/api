import { Schema, model, Document } from 'mongoose'

export type PostVisibility = 'public' | 'private' | 'not-listed'

export interface IPost extends Document {
  slug: string, // learning-javascript
  title: string, // Learning Javascript
  html: string,
  hero_image?: string,
  visibility: PostVisibility,
  excerpt: string, // Welcome to this...
  reading_time: number,
  author: string, // blog name author,
  tags?: string[],
  url: string, // blog.url/p/learning-javascript
}

export const postSchema = new Schema({
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  html: {
    type: String,
    required: true,
  },
  hero_image: {
    type: String,
  },
  visibility: {
    type: String,
    required: true,
    enum: ['public', 'private', 'not-listed'],
  },
  excerpt: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 40,
  },
  reading_time: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  tags: {
    type: Array({
      type: String,
      minlength: 1,
      maxlength: 15,
    }),
  },
}, {
  timestamps: true,
})

export default model<IPost>('Post', postSchema)
