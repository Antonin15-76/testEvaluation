import { GeneralError, NotFoundError, UserInputError, HasChildrenError, UniqueError, CreateManyError, UpdateManyError, DeleteManyError, IsDefaultError, errorablePromiseHandler, DeleteCascadeError } from 'errors/'
import Joi from 'joi'
import { DateTime } from 'luxon'
import { clearFromLoader, loadFromLoader } from 'server/dataloaders'
import { ObjectId } from 'mongodb'

const collectionName = 'user'

const schema = Joi.object({
  pseudo: Joi.string().trim().required().label('pseudo'),
  password: Joi.string().trim().required().label('password'),
  userType: Joi.string().trim().optional().allow(null, '').label('userType'),
  isActif: Joi.bool().optional().allow(null, '').label('isActif')
})

export const nameResolve = async (user, _, ctx) => user.pseudo
export const passwordResolve = async (user, _, ctx) => user.password
export const userTypeResolve = async (user, _, ctx) => user.userType
export const isActifResolve = async (user, _, ctx) => user.isActif

export const userResolve = async (root, { id }, ctx) => {
  console.log('22', id)
  if (!id) return null
  console.log(ctx.loaders)
  const user = await loadFromLoader(ctx.loaders.userLoader, id)
  if (!user) throw new NotFoundError('User not found', { userId: id })
  return user
}

export const usersResolve = async (root, { input = {}, count = false }, ctx) => {
  const collection = await ctx.db.collection(collectionName)
  const datas = collection.find().toArray()
  // const { search = {}, sort = { name: 1 }, limit = 0, skip = 0 } = input
  // const aggregation = []
  // const { text } = search

  // if (text?.trim()) aggregation.push({ $match: { $text: { $search: text.trim().toLowerCase() } } })
  // if (count) {
  //   aggregation.push({ $count: 'count' })
  //   const res = await collection.aggregate(aggregation).next()
    // return res?.count ?? 0
  // }

  // aggregation.push({ $sort: text?.trim() ? { score: { $meta: 'textScore' }, ...sortInputToSortObject(sort) } : { ...sortInputToSortObject(sort) } })
  // if (skip) aggregation.push({ $skip: skip })
  // if (limit) aggregation.push({ $limit: limit })
  // return collection.aggregate(aggregation).toArray()
  return datas
}

const testValidity = async (doc, ctx) => {
  const objectToUser = {
    pseudo: doc.pseudo,
    password: doc.password,
    userType: doc.userType,
    isActif: doc.isActif
  }
  const result = schema.validate(objectToUser)
  if (result.error) throw new UserInputError('Validation Failed', { error: result.error })
  const findObj = { pseudo: doc.pseudo }
  if (doc._id) findObj._id = { $ne: doc._id }
  const userDocument = await ctx.db.collection(collectionName).findOne(findObj)
  if (userDocument) throw new UniqueError('', { value: doc, otherValue: userDocument })

  return userDocument
}

const preCreate = async (doc, ctx) => {
  return testValidity(doc, ctx)
}

const postCreate = async (id, ctx) => {
  return userResolve(null, { id }, ctx)
}

export const createUserResolve = async (root, {input}, ctx) => {
  const collection = await ctx.db.collection(collectionName)

  const objectToInsert = {
    pseudo: input.pseudo,
    password: input.password,
    userType: input.userType,
    isActif: input.isActif,
    createdAt: DateTime.local().setZone(ctx.timeZone).toUTC().toJSDate(),
    updatedAt: DateTime.local().setZone(ctx.timeZone).toUTC().toJSDate()
  }
  const userDocument = await preCreate(objectToInsert, ctx)
  if (userDocument) postCreate(userDocument._id, ctx)
  let id
  try {
    id = (await collection.insertOne(objectToInsert)).insertedId
  } catch (err) {
    if (err instanceof ApolloError) throw err
    throw new GeneralError(err.message, err)
  }
  return postCreate(id, ctx)
}

const preUpdate = async (doc, ctx, bypassUnicity) => {
  return testValidity(doc, ctx)
}

const postUpdate = async (id, ctx) => {
  await clearFromLoader(ctx.loaders.userLoader, id)
  const user = await userResolve(null, { id }, ctx)
  return user
}

export const updateUserResolve = async (root, {id, input}, ctx) => {
  const collection = await ctx.db.collection(collectionName)
 
  const prevValue = await userResolve(null, { id }, ctx)
    const objectToUpdate = {
      ...prevValue,
      updatedBy: ObjectId(ctx.currentUser),
      updatedAt: DateTime.local().setZone(ctx.timeZone).toUTC().toJSDate()
    }

  if (input?.pseudo) objectToUpdate.pseudo = input.pseudo
  if (input?.password) objectToUpdate.password = input.password
  if (input?.userType) objectToUpdate.userType = input.userType
  if (input?.isActif) objectToUpdate.isActif = input.isActif

  await preUpdate(objectToUpdate, ctx)

  try {
    await collection.updateOne({ _id: objectToUpdate._id }, { $set: { ...objectToUpdate } })
  } catch (err) {
    if (err instanceof ApolloError) throw err
    throw new GeneralError(err.message, err)
  }
  return postUpdate(id, ctx)
}