import { Request, Response, NextFunction } from 'express'
import { HTTP400Error } from '../utils/httpErrors'
import { CreateBlogPayload, CreatePostPayload } from '../plugins/content/types'

export const checkRegisterParams = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.credentials) {
    throw new HTTP400Error('Missing `credentials` object.')
  } else {
    next()
  }
}

export const checkCreateBlogParams = (req: Request, res: Response, next: NextFunction) => {
  const { description, name, user } = req.body
  const requiredParams: CreateBlogPayload = { description, name, user }

  for (const param in requiredParams) {
    if (!param) throw new HTTP400Error(`Missing ${param}.`)
  }

  next()
}

export const checkCreatePostParams = (req: Request, res: Response, next: NextFunction) => {
  const { description, slug, blog, html, title, visibility } = req.body
  const requiredParams: CreatePostPayload = { description, slug, html, title, visibility, blog }

  for (const param in requiredParams) {
    if (!param) throw new HTTP400Error(`Missing ${param}.`)
  }

  next()
}
