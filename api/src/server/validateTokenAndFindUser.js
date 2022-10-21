import { AuthenticationError, NotFoundError } from 'errors/'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { dbPromise } from 'utils'

const validateTokenAndFindUser = async (authHeader) => {
  if (process.env.NODE_ENV === 'development') {
    const user = (await dbPromise).collection('user').findOne({ username: 'vmetton@spha.fr' })
    return user._id
  }
  if (!authHeader) {
    throw new AuthenticationError('No header provided')
  }
  if (
    authHeader.includes('Bearer') &&
      authHeader.substring('Bearer'.length + 1) === 'undefined'
  ) {
    throw new AuthenticationError('No header provided')
  }
  const payload = authHeader.includes('Bearer')
    ? jwt.decode(authHeader.substring('Bearer'.length + 1), process.env.SECRET)
    : jwt.decode(authHeader, process.env.SECRET)
  if (!payload) {
    throw new AuthenticationError('Bad header provided')
  }
  if (!payload.userId) {
    throw new AuthenticationError('Bad header provided')
  }
  const db = await dbPromise

  const user = await db.collection('user').findOne({ _id: ObjectId(payload.userId) })
  if (!user) {
    throw new NotFoundError('User not found')
  }
  return user._id
}

export default validateTokenAndFindUser
