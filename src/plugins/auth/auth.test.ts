/**
 * Routes Integration test
 */

import express, { Router } from 'express'
// TODO: REMOVE - import promiseRequest from 'request-promise'
import routes from '../index'
import { clearDatabase, closeDatabase, connectTestDatabase } from '../../db/db-handler'
import request from 'supertest'

describe('POST /auth/register', () => {
  let router: Router

  beforeEach(async () => {
    router = express()
    await connectTestDatabase(router, routes)
  })

  /** Clear all test data after every test. */
  afterEach(async () => clearDatabase())

  /** Remove and close the db and server. */
  afterAll(async () => closeDatabase())

  it('should succeed when registering with VALID credentials.', async () => {
    const response = await request(router)
      .post('/api/auth/register')
      .expect('Content-Type', /json/)
      .send({ credentials: { email: 'stub-email@gamil.com', firstName: 'stub-name', lastName: 'stub-name', password: 'stub-password' } })

    expect(response.status).toEqual(200)
  })

  it('should fail when registering with INVALID credentials.', async () => {
    const response = await request(router)
      .post('/api/auth/register')
      .expect('Content-Type', /json/)
      .send({ credentials: { email: 'stub-email', firstName: 'stub-name', lastName: 'stub-name', password: 'stub-password' } })

    expect(response.status).toEqual(422)
  })

  it('should fail when registering with already registred user.', async () => {
    const response = await request(router)
      .post('/api/auth/register')
      .expect('Content-Type', /json/)
      .send({ credentials: { email: 'test@gmail.com"', firstName: 'stub-name', lastName: 'stub-name', password: 'stub-password' } })

    expect(response.status).toEqual(422)
  })

  it('should fail when registering with an empty object.', async () => {
    const response = await request(router)
      .post('/api/auth/register')
      .send({})

    expect(response.status).toEqual(400)
  })

  it('should fail when login in with an empty object.', async () => {
    const response = await request(router)
      .post('/api/auth/login')
      .send({})

    expect(response.status).toEqual(400)
  })

  it('should fail when login in with a not registered user.', async () => {
    const response = await request(router)
      .post('/api/auth/login')
      .expect('Content-Type', /json/)
      .send({ credentials: { password: 'stub-password', email: 'stub-email@gmail.com' } })

    expect(response.body.message).toEqual('Email stub-email@gmail.com is not linked to any user, please register.')
    expect(response.status).toEqual(401)
  })

  it('should fail when login in with INVALID credentials.', async () => {
    const response = await request(router)
      .post('/api/auth/login')
      .expect('Content-Type', /json/)
      .send({ credentials: { password: 'stub-password', email: 'stub-email' } })

    expect(response.status).toEqual(422)
  })

  it('should throw a 404 when hiting a non-existing api method.', async () => {
    const response = await request(router).get('/api/this-does-not-exist')

    expect(response.status).toEqual(404)
  })
})
