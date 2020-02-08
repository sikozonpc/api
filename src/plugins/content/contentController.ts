import BlogModel from '../../models/blog.model'
import PostModel from '../../models/post.model'
import { HTTP401Error, HTTP404Error } from '../../utils/httpErrors'
import { CreateBlogPayload, CreatePostPayload } from './types'
import { sluggify } from '../../utils/sluggify'
import { apiKeyGenerate } from '../auth/authController'
import getReadTime from '../../utils/getReadTime'

/**
 * Creates a blog from a userID
 */
export const createBlog = async (payload: CreateBlogPayload) => {
  const { description, name, user } = payload

  const freshBlog = new BlogModel({
    description,
    name,
    author: `${user.firstName} ${user.lastName}`,
    key: apiKeyGenerate(),
  })

  freshBlog.save()

  return {
    api_key: freshBlog.key,
    name: freshBlog.name,
    message: 'Blog created successfuly !',
  }
}

/**
 * Creates a post and associates with
 */
export const createPost = async (payload: CreatePostPayload) => {
  const { description, html, title, hero_image, visibility, tags, slug, blog } = payload

  if (!blog) {
    throw new HTTP401Error('No blog found, please check if your API KEY is valid.')
  }

  const readTime = getReadTime(html)
  const excerpt = description.slice(0, 25) + '...'
  const url = sluggify(title)

  const freshPost = new PostModel({
    description,
    html,
    title,
    slug,
    hero_image,
    excerpt,
    url,
    visibility,
    tags,
    reading_time: readTime,
    author: blog.author,
  })

  freshPost.save()

  // Store the post on the blog posts
  blog.posts.push(freshPost)
  blog.save()

  return {
    message: 'Post successfuly created!',
    post: freshPost,
  }
}

export const getPostByID = async (id: string) => {
  if (!id) throw new HTTP401Error('No ID has been sent.')

  try {
    const post = await PostModel.findById(id)

    return post
  } catch (error) {
    throw new HTTP404Error(`Post with ID ${id} was not found.`)
  }
}
