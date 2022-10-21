import MongoClient from 'mongodb'

const defaultOptions = { useUnifiedTopology: true, useNewUrlParser: true }
const options = process.env.NODE_ENV === 'production' && process.env.MONGO_USERNAME ? { authSource: 'admin', auth: { user: process.env.MONGO_USERNAME, password: process.env.MONGO_PASSWORD } } : {}
export const mongoClientPromise = MongoClient.connect(process.env.MONGO_URL, { ...defaultOptions, ...options }).catch((err) => {
  console.error(err)
})
/**
 * @type {Promise<import('mongodb').Db>}
 */

 export const dbPromise = mongoClientPromise.then(client => client.db(process.env.MONGO_DATABASE)).catch((err) => {
  console.error(err)
})
/** @returns {import('mongodb').Collection} */
export const getCollection = (collectionName, ctx) => {
  if (ctx.db) {
    if (!ctx.collections[collectionName]) ctx.collections[collectionName] = ctx.db.collection(collectionName)
    return ctx.collections[collectionName]
  }
  return null
}
/** @returns {import('dataloader')} */
export const getLoader = (collectionName, ctx) => ctx.loaders[`${collectionName}Loader`]

export const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })