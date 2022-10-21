import { GeneralError, NotFoundError, UserInputError, HasChildrenError, UniqueError, CreateManyError, UpdateManyError, DeleteManyError, IsDefaultError, errorablePromiseHandler, DeleteCascadeError } from 'errors/'
import Joi from 'joi'
import { DateTime } from 'luxon'
import { loadFromLoader } from 'server/dataloaders'
import { ObjectId } from 'mongodb'

const collectionName = 'test'

const schema = Joi.object({
  name: Joi.string().trim().optional().allow(null, '').label('name'),
})

export const nameResolve = async (test, _, ctx) => test.name

export const testResolve = async (root, { id }, ctx) => {
  if (!id) return null
  console.log(ctx.loaders)
  const test = await loadFromLoader(ctx.loaders.testLoader, id)
  if (!test) throw new NotFoundError('ArticleCaracteristic not found', { testId: id })
  return test
}

export const testsResolve = async (root, { input = {}, count = false }, ctx) => {
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
  const objectToTest = {
    name: doc.name,
  }
  const result = schema.validate(objectToTest)
  if (result.error) throw new UserInputError('Validation Failed', { error: result.error })
  const findObj = { name: doc.name }
  if (doc._id) findObj._id = { $ne: doc._id }
  const testDocument = await ctx.db.collection(collectionName).findOne(findObj)
  if (testDocument) throw new UniqueError('', { value: doc, otherValue: testDocument })

  return testDocument
}

const preCreate = async (doc, ctx) => {
  return testValidity(doc, ctx)
}

const postCreate = async (id, ctx) => {
  return testResolve(null, { id }, ctx)
}

export const createTestResolve = async (root, {input}, ctx) => {
  const collection = await ctx.db.collection(collectionName)

  const objectToInsert = {
    name: input.name,
    // createdBy: ObjectId(ctx.currentUser),
    // updatedBy: ObjectId(ctx.currentUser),
    createdAt: DateTime.local().setZone(ctx.timeZone).toUTC().toJSDate(),
    updatedAt: DateTime.local().setZone(ctx.timeZone).toUTC().toJSDate()
  }
  const testDocument = await preCreate(objectToInsert, ctx)
  if (testDocument) postCreate(testDocument._id, ctx)
  let id
  try {
    id = (await collection.insertOne(objectToInsert)).insertedId
  } catch (err) {
    if (err instanceof ApolloError) throw err
    throw new GeneralError(err.message, err)
  }
  return postCreate(id, ctx)
}
