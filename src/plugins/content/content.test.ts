import routes from '../index'
import { clearDatabase, closeDatabase, connectTestDatabase } from '../../db/db-handler'
import express, { Router } from 'express'
import request from 'supertest'
import promiseRequest from 'request-promise'

// Timer to install MongoDB driver when first running
jest.setTimeout(60000)

// @TOOD: See this for setup dummy data https://github.com/shelfio/jest-mongodb

describe('Content', () => {
  let router: Router

  beforeEach(async () => {
    router = express()
    await connectTestDatabase(router, routes)
  })

  /** Clear all test data after every test. */
  afterEach(async () => clearDatabase())

  /** Remove and close the db and server. */
  afterAll(async () => closeDatabase())

  it('should FAIL when creating a blog without valid user.', async () => {
    const response = await request(router)
      .post('/api/content/blog')
      .expect('Content-Type', /json/)
      .send({ userID: '5e2d95fb243fcf5bf8cffbf2', name: 'some name', description: 'just some description' })

    expect(response.status).toEqual(500)
  })
})
