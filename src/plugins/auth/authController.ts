import UserModel from '../../models/user.model'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { HTTP401Error, HTTP404Error } from '../../utils/httpErrors'
import uuidv4 from 'uuid/v4'
import BlogModel from '../../models/blog.model'

export interface Credentials {
  firstName: string,
  lastName: string,
  password: string,
  email: string,
}

export interface LoginCredentials {
  email: Credentials['email'],
  password: Credentials['password'],
}

/**
 * Registers a new user.
 */
export const registerUser = async (credentials: Credentials) => {
  const hashedPassword = await bcrypt.hash(credentials.password, 12)

  const freshUser = new UserModel({ ...credentials, password: hashedPassword })
  freshUser.save()

  return {
    message: 'Account has been successfuly registred!',
    user_id: freshUser._id,
  }
}

/**
 * Logins a user and returns an `access_token` with a validity time.
 */
export const loginUser = async (loginCredentials: LoginCredentials) => {
  const { email, password } = loginCredentials

  // Find if the user exists
  const user = await UserModel.findOne({ email })

  if (!user) {
    throw new HTTP401Error(`Email ${email} is not linked to any user, please register.`)
  }

  // Create an access token for the user to access the app
  if (!process.env.JTW_SECRET) {
    throw new Error('No JWT_SECRET')
  }

  // Validate password and hashed one
  const comparePasswords = await bcrypt.compare(password, user.password)

  if (!comparePasswords) {
    throw new HTTP401Error('Wrong password.')
  }

  const accessToken = jwt.sign(
    { email, id: user._id.toString() },
    process.env.JTW_SECRET,
    {
      expiresIn: '24h',
    })

  return {
    message: 'Logged in successfuly!',
    access_token: accessToken,
    expiresIn: '24h',
    id: user._id.toString(),
  }
}

/**
 * Get's a user by it's ID
 */
export const getUserByID = async (id: string) => {
  if (!id) {
    throw new HTTP401Error('No userID provided.')
  }

  try {
    // Check if the user exists and get his data
    const user = await UserModel.findById(id)

    return user
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Generates an API key to access private endpoints
 */
export const apiKeyGenerate = () => {
  return uuidv4()
}

/**
 * Validation layer for the private endpoints, it validates the api key
 * and returns the blog data that's linke to the account
 */
export const validateKey = async (key: string) => {
  if (!key) throw new HTTP401Error('To access this endpoint you require a API KEY')

  // Find the blog that's linked to this key
  const blog = await BlogModel.findOne({ key })

  if (!blog) throw new HTTP404Error('Invalid API KEY, please check if the key is typed correctly or you have a valid key')

  return blog
}
