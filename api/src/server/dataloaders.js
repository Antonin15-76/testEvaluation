import DataLoader from 'dataloader'
import { ObjectID } from 'mongodb'
import { mapIds } from 'utils/utils'

export const loadManyFromLoader = async (loader, data) => loader.loadMany(data.map(mapIds))
export const loadManyFromLoaderId = async (loader, data) => loader.loadMany(data)
export const loadFromLoader = async (loader, key) => loader.load(key.toString())
export const clearFromLoader = (loader, key) => loader.clear(key)
export const clearManyFromLoader = (loader, keys) => loader.clearAll(keys)
const batch = async (collection, keys) => {
  const res = await collection.find({ _id: { $in: keys.map(x => ObjectID(x)) } }).toArray()

  const map = res.reduce((accu, x) => { accu[x._id] = x; return accu }, {})
  return keys.map(x => map[x])
}

export default async db => {
  const collections = await db.collections()

  const accu = {}
  for (const collection of collections) {
    accu[`${collection.collectionName}Loader`] = new DataLoader(
      keys => batch(collection, keys),
      { cacheKeyFn: key => key.toString() }
    )
  }

  return accu
}
