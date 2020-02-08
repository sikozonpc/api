import mongoose, { ConnectionOptions } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { Router } from 'express'
import middleware from '../middleware'
import errorHandlers from '../middleware/errorHandlers'
import { applyMiddleware, applyRoutes } from '../utils'

const mongod = new MongoMemoryServer({
  instance: {
    dbName: 'jest',
  },
  binary: {
    version: '4.0.3',
  },
  autoStart: false,
})

/**
 * Connect to the in-memory database.
 */
export const connect = async () => {
  const uri = await mongod.getConnectionString()

  const mongooseOpts: ConnectionOptions = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  }

  await mongoose.connect(uri, mongooseOpts)
}

/**
 * Drop database, close the connection and stop mongod.
 */
export const closeDatabase = async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongod.stop()
}

/**
 * Remove all the data for all db collections.
 */
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    // @ts-ignore
    await collection.deleteMany()
  }
}

/**
 * Connects to a in memory database for running integration teests
 */
export const connectTestDatabase = async (router: Router, routes: any[]) => {
  await connect()
  applyMiddleware(middleware, router)
  applyRoutes(routes as any, router)
  applyMiddleware(errorHandlers, router)
}
