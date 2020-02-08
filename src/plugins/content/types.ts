import { IPost } from '../../models/post.model'
import { IBlog } from '../../models/blog.model'
import { IUser } from '../../models/user.model'

export interface CreateBlogPayload {
  //* * user id to link the blog to a user */
  user: IUser,
  name: string,
  description: string,
  logo_image?: string,
  cover_image?: string,
  lang?: string, // defaults to 'en'
}

export interface CreatePostPayload {
  title: string,
  description: string,
  html: string,
  hero_image?: string,
  visibility: IPost['visibility'],
  tags?: IPost['tags'],
  slug: string,
  blog: IBlog,
}
