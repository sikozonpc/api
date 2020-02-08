import { matchedData, validationResult, body } from 'express-validator'
import { Response, NextFunction } from 'express'
import UserModel from '../models/user.model'

/**
 *  Validation rules
*/
export const registerUserRules = () => {
  return [
    body('credentials.email').isEmail().custom((value) => {
      return UserModel.findOne({ email: value.toLowerCase() }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(new Error('Email adress already exists.'))
        }
      })
    }).normalizeEmail(),
    body('credentials.firstName').trim().isLength({ min: 2, max: 30 }),
    body('credentials.lastName').trim().isLength({ min: 2, max: 30 }),
    body('credentials.password').trim().isLength({ min: 3, max: 100 }),
  ]
}

export const loginUserRules = () => {
  return [
    body('credentials.email').isEmail().normalizeEmail(),
    body('credentials.password').trim().isLength({ min: 3, max: 100 }),
  ]
}

export const createBlogRules = () => {
  return [
    body('userID').not().notEmpty().withMessage('Missing userID.'),
    body('name').trim().isLength({ min: 2, max: 30 }).withMessage('Invalid name value.'),
    body('description').trim().isLength({ min: 2, max: 100 }).withMessage('Invalid description value.'),
  ]
}

export const createPostRules = () => {
  return [
    body('title').trim().isLength({ min: 2, max: 30 }).withMessage('Invalid title value.'),
    body('slug').trim().isLength({ min: 2, max: 30 }).withMessage('Invalid slug value.'),
    body('description').trim().isLength({ min: 2, max: 100 }).withMessage('Invalid description value.'),
    body('html').trim().isLength({ min: 2, max: 100 }).withMessage('Invalid html value.'),
  ]
}

/**
 * Validates if express-valitor found any errors
 */
function validateRules (req: any, res: Response, next: NextFunction) {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    req.matchedData = matchedData(req)
    return next()
  }

  const extractedErrors: any[] = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  res.status(422).json({
    errors: extractedErrors,
  })
}

export default validateRules
