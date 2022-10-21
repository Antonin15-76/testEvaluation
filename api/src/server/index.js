import { PubSub } from 'apollo-server'
import { ApolloServer } from 'apollo-server-express'
import { nanoid } from 'nanoid'
import nexusSchema from 'schema'
import { dbPromise, mongoClientPromise } from 'utils'
import expressApp from './expressApp'
import http from 'http'
import dataloaders from './dataloaders'
import validateTokenAndFindUser from './validateTokenAndFindUser'

/**
 * @param db {import('mongodb').Db}
 */
 const getCollections = async (db) => {
  const collections = {}
  if (db) {
    const collectionsInDb = await db.listCollections().toArray()
    for (const collectionInDb of collectionsInDb) {
      collections[collectionInDb.name] = await db.collection(collectionInDb.name)
    }
  }
  return collections
}

const getFromConnection = async (connection) => {
  return {
    locale: connection.context.locale,
    timeZone: connection.context.TimeZone
  }
}

const getFromRequest = async request => {
  console.log(`Bearer ${process.env.ESCIENT_API_TOKEN}`)
  const tokenHeader = request.header('Authorization') || `Bearer ${process.env.ESCIENT_API_TOKEN}`
  const token = tokenHeader.substring(7)
  return {
    // currentUser: request.currentUser,
    locale: request.acceptsLanguages('fr') || 'en_GB',
    timeZone: request.header('TimeZone') || 'UTC',
    token: token
  }
}

const getData = async ({ req, connection }) => {
  if (connection) return getFromConnection(connection)
  return getFromRequest(req)
}

const formatError = (err) => {
  console.error(JSON.stringify(err, null, 2))
  return err
}

let server
const pubsub = new PubSub()

;(async () => {
  console.log('Starting Server...')
  const db = await dbPromise
  const collections = await getCollections(db)
  console.log('MongoDB Connected')
  server = new ApolloServer({
    schema: nexusSchema,
    uploads: false,
    formatError,
    cors: { origin: '*' },
    tracing: true,
    cacheControl: true,
    subscriptions: {
      path: '/subscriptions',
      onConnect: (connectionParams, webSocket) => {
        const token = connectionParams.Authorization || connectionParams.token
          try {
            return validateTokenAndFindUser(token)
          } catch (err) {
            console.error(err)
          }
        throw new Error('Missing auth header!')
      }
    },
    endpoint: '/graphql',
    context: async contextParams => {
      const data = await getData(contextParams)
      const loaders = await dataloaders(db)
      /*  const visorDatabase = await visorDatabasePromise */
      const idRequest = nanoid()
      return { ...data, collections, pubsub, loaders, db, idRequest, req: contextParams.req /* visorDatabase */ }
    },
    playground: 'true',
    introspection: true
  })
  server.applyMiddleware({ app: expressApp, cors: false })
  const httpServer = http.createServer(expressApp)
  server.installSubscriptionHandlers(httpServer)
  httpServer.listen(process.env.PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`)
  })
})()




const defaultOptions = { useUnifiedTopology: true, useNewUrlParser: true }

// export const mongoClientPromise = MongoClient.connect(process.env.MONGO_URL, defaultOptions)

// export const server = getApolloServer(mongoClientPromise)

// server.listen(process.env.PORT, () => {
//   console.log(`🚀 Server ready running at http://localhost:${process.env.PORT}  `)
//   console.log(`🚀 Playground ready running at http://localhost:${process.env.PORT}/graphql  `)
// })

/**
 * Fonction exécutée si un signal d'arrêt est détecté.
 */
const cleanup = () => {
  console.info('Cleaning up')
  // server.close()
  dbPromise.then(db => {
    db.collection('batigestRevenueSynchronization')
      .updateMany({ status: 'SYNCING' }, { $set: { status: 'ABORTED' } })
      .then(() => mongoClientPromise.then((mc) => mc.close()))
  })
}
process.on('beforeExit', cleanup)
// process.on('')
process.on('SIGHUP', cleanup)
process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)
process.on('SIGBREAK', cleanup)
process.on('SIGUSR2', cleanup)
process.on('message', msg => {
  if (msg === 'shutdown') {
    cleanup()
  }
})

  