import { config } from 'dotenv'
import Server from './config/server'
import { createServer } from 'http'
import signale from 'signale'
import Config from './config'
config()

const applicationServer = Server.bootstrap()
const server = createServer(applicationServer)

server.listen(Config.PORT)
server.on('listening', onListing)
server.on('error', onError)

process.on('uncaughtException', event => {
  signale.log('uncaughtException', event)
  process.exit(1)
})
process.on('unhandledRejection', event => {
  signale.log('unhandledRejection', event)
  process.exit(1)
})

function onListing () {
  signale.success(`🚀  Server listening on http://localhost:${Config.PORT} `)
}

function onError (error: Error) {
  signale.error('There was an error:', error)
}
