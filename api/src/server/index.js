import { PubSub } from 'apollo-server'
import { ApolloServer } from 'apollo-server-express'
import { nanoid } from 'nanoid'
import nexusSchema from 'schema'
import { dbPromise, mongoClientPromise } from 'utils'
import expressApp from './expressApp'
import http from 'http'
import dataloaders from './dataloaders'

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
  const tokenHeader = request.header('Authorization') || `Bearer ${process.env.ESCIENT_API_TOKEN}`
  const token = tokenHeader.substring(7)
  return {
    currentUser: request.currentUser,
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
        // const token = connectionParams.Authorization || connectionParams.token
        // if (token || process.env.NODE_ENV === 'development') {
        //   try {
        //     return validateTokenAndFindUser(token)
        //   } catch (err) {
        //     console.error(err)
        //   }
        // }
        // throw new Error('Missing auth header!')
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

// import { ApolloServer } from 'apollo-server-express'
// import { PubSub } from 'apollo-server'
// import http from 'http'
// import expressApp from './expressApp'
// import addModelsToContext from '../model'
// import newSchema from '../schema'
// import validateTokenAndFindUser from './validateTokenAndFindUser'
// import dataloaders from './dataloaders'
// import { nanoid } from 'nanoid'
// import { dbPromise, mongoClientPromise } from 'utils'
// import { supplierOrderMailTransporter } from '../mailTransporter'
// import { browserPromise } from 'utils/generatePDFFromHTML'
// import Bree from 'bree'
// import path from 'path'
// import fs from 'fs'

// /**
//  * @param db {import('mongodb').Db}
//  */
//  const getCollections = async (db) => {
//     const collections = {}
//     if (db) {
//       const collectionsInDb = await db.listCollections().toArray()
//       for (const collectionInDb of collectionsInDb) {
//         collections[collectionInDb.name] = await db.collection(collectionInDb.name)
//       }
//     }
//     return collections
//   }
  
//   /* import { connectSql } from 'utils/sqlUtils'
  
//   const visorConfig = {
//     user: process.env.VISOR_USER,
//     password: process.env.VISOR_PASSWORD,
//     server: process.env.VISOR_SERVER,
//     database: process.env.VISOR_DATABASE,
//     encrypt: false
//   } */
  
//   /* const visorDatabasePromise = connectSql(visorConfig) */
  
//   const getFromConnection = async (connection) => {
//     return {
//       locale: connection.context.locale,
//       timeZone: connection.context.TimeZone
//     }
//   }
  
//   const getFromRequest = async request => {
//     const tokenHeader = request.header('Authorization') || `Bearer ${process.env.ESCIENT_API_TOKEN}`
//     const token = tokenHeader.substring(7)
//     return {
//       currentUser: request.currentUser,
//       locale: request.acceptsLanguages('fr') || 'en_GB',
//       timeZone: request.header('TimeZone') || 'UTC',
//       token: token
//     }
//   }
  
//   const getData = async ({ req, connection }) => {
//     if (connection) return getFromConnection(connection)
//     return getFromRequest(req)
//   }
  
//   const formatError = (err) => {
//     console.error(JSON.stringify(err, null, 2))
//     return err
//   }
  
//   let server
//   const pubsub = new PubSub()
  
//   ;(async () => {
//     console.log('Starting Server...')
//     const db = await dbPromise
//     const collections = await getCollections(db)
//     console.log('MongoDB Connected')
//     const context = addModelsToContext({ db })
//     console.log('Context added')
//     server = new ApolloServer({
//       schema: newSchema,
//       uploads: false,
//       formatError,
//       cors: { origin: '*' },
//       tracing: true,
//       cacheControl: true,
//       subscriptions: {
//         path: '/subscriptions',
//         onConnect: (connectionParams, webSocket) => {
//           const token = connectionParams.Authorization || connectionParams.token
//           if (token || process.env.NODE_ENV === 'development') {
//             try {
//               return validateTokenAndFindUser(token)
//             } catch (err) {
//               console.error(err)
//             }
//           }
//           throw new Error('Missing auth header!')
//         }
//       },
//       endpoint: '/graphql',
//       context: async contextParams => {
//         const data = await getData(contextParams)
//         const loaders = await dataloaders(db)
//         /*  const visorDatabase = await visorDatabasePromise */
//         const idRequest = nanoid()
//         return { ...context, ...data, collections, pubsub, loaders, db, idRequest, req: contextParams.req, supplierOrderMailTransporter /* visorDatabase */ }
//       },
//       playground: 'true',
//       introspection: true
//     })
//     server.applyMiddleware({ app: expressApp, cors: false })
//     const httpServer = http.createServer(expressApp)
//     server.installSubscriptionHandlers(httpServer)
//     httpServer.listen(process.env.PORT, () => {
//       console.log(`🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`)
//       console.log(`🚀 Subscriptions ready at ws://localhost:${process.env.PORT}${server.subscriptionsPath}`)
//     })
//   })()
  
//   const cleanup = () => {
//     console.info('Cleaning up')
//     // server.close()
//     browserPromise.then(browser => {
//       browser.close()
//     })
//     dbPromise.then(db => {
//       db.collection('batigestRevenueSynchronization')
//         .updateMany({ status: 'SYNCING' }, { $set: { status: 'ABORTED' } })
//         .then(() => mongoClientPromise.then((mc) => mc.close()))
//     })
//   }
//   process.on('beforeExit', cleanup)
//   // process.on('')
//   process.on('SIGHUP', cleanup)
//   process.on('SIGINT', cleanup)
//   process.on('SIGTERM', cleanup)
//   process.on('SIGBREAK', cleanup)
//   process.on('SIGUSR2', cleanup)
//   process.on('message', msg => {
//     if (msg === 'shutdown') {
//       cleanup()
//     }
//   })
  
//   // GESTION DES NOTIFICATIONS
  
//   if (process.env.USE_JOBS) {
//     const useTestString = false
  
//     /**
//      * "1/1 * * * *" : Every Minute
//      * "0 3 * * *" : At 03:00 everyday
//      */
  
//     const cronString = useTestString ? '1/1 * * * *' : '0 3 * * *'
  
//     const root = path.resolve(process.env.JOBS_PATH)
  
//     const files = fs.readdirSync(root).filter(filename => /.js$/.test(filename)) // On récupère seulement les fichiers en .js
  
//     const jobs = files.map(x => ({ name: x.substr(0, x.length - 3), cron: cronString })) // Exemple : {name: 'medicalVisitNotification', cron: '0 3 * * *' }
  
//     const bree = new Bree({
//       root: root,
//       jobs: jobs
//     })
  
//     bree.start()
//   }
  