import { Schema, model, Document } from 'mongoose'
import { IPost, postSchema } from './post.model'

export interface IBlog extends Document {
  name: string,
  posts: IPost[],
  author: string,
  key: string, // public api key to fetch data related to the blog
  description: string,
  logo_image?: string,
  cover_image?: string,
  lang?: string,
}

const blogSchema = new Schema({
  posts: [postSchema],
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  author: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  logo_image: String,
  cover_image: String,
  lang: String,
})

export default model<IBlog>('Blog', blogSchema)
