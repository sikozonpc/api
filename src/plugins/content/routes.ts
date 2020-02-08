import { Request, Response, NextFunction } from 'express'
import { createBlog, createPost, getPostByID } from './contentController'
import { checkCreateBlogParams, checkCreatePostParams } from '../../middleware/checks'
import expressValidator, { createBlogRules, createPostRules } from '../../utils/expressValidator'
import { CreateBlogPayload } from './types'
import signale from 'signale'
import { validateKey, getUserByID } from '../auth/authController'
import { HTTP404Error } from '../../utils/httpErrors'

export default [
  {
    path: '/api/content/blog',
    method: 'post',
    handler: [
      checkCreateBlogParams,
      createBlogRules(),
      expressValidator,

      async (req: Request, res: Response, next: NextFunction) => {
        const { body } = req
        const { description, name, userID } = body

        try {
          const user = await getUserByID(userID)
          if (!user) throw new Error('No user provided')

          const payload: CreateBlogPayload = { description, name, user }
          const result = await createBlog(payload)

          signale.success(result)
          res.status(200).json(result)
        } catch (error) {
          next(error)
        }
      },
    ],
  },
  {
    path: '/api/content/blog', // @KEY-PROTCTED
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const apiKey = req.query.key || req.query.KEY

        try {
          const result = await validateKey(apiKey)

          signale.success(result)
          res.status(200).json(result)
        } catch (error) {
          next(error)
        }
      },
    ],
  },
  {
    path: '/api/content/post', // @KEY-PROTCTED
    method: 'post',
    handler: [
      checkCreatePostParams,
      createPostRules(),
      expressValidator,

      async (req: Request, res: Response, next: NextFunction) => {
        const { body } = req
        const apiKey = req.query.key || req.query.KEY

        try {
          const blog = await validateKey(apiKey)
          const result = await createPost({ ...body, blog })

          signale.success(result)
          res.status(200).json(result)
        } catch (error) {
          next(error)
        }
      },
    ],
  },
  {
    path: '/api/content/post/:id',
    method: 'get',
    handler: [
      async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id

        try {
          const result = await getPostByID(id)

          if (!result) throw new HTTP404Error(`Post with ID ${id} was not found.`)

          signale.success(result)
          res.status(200).json(result)
        } catch (error) {
          next(error)
        }
      },
    ],
  },
]
