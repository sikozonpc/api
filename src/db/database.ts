import { connect } from 'mongoose'
import signale from 'signale'
import { MongoClientOptions } from 'mongodb'

const mongoOptions: MongoClientOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

/** Connects to a mongo instance */
export const mongoConnect = (callback?: (...args: any) => void) => {
  if (process.env.MONGODB_KEY) {
    signale.pending('🗄️   Connecting to the MongoDB Instance...')
    connect(process.env.MONGODB_KEY, mongoOptions)
      .then(_client => {
        signale.success('🗄️  ✅   Connected to MongoDB Database successfully !')
        callback && callback()
      })
      .catch(error => {
        signale.error('🗄️  ❌   Connection to database failed: ', error)
        callback && callback()
      })
  } else {
    signale.error('🗄️  ❌   No connection key to the databse.')
  }
}
