import { AuthenticationError, NotFoundError, TokenError } from 'errors'
import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { dbPromise } from '../utils'

/**
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {any} next
 */
const verifyAuthentication = async (req, res, next) => {
  // if (process.env.NODE_ENV === 'development') {
  //   req.currentUser = (await (await dbPromise).collection('user').findOne({ username: 'vmetton@spha.fr' }))._id
  //   return next()
  // }
  const authHeader = req.header('Authorization') ?? null
  try {
  //   // On vérifie si le header est présent
    if (!authHeader) {
      throw new AuthenticationError('No header provided')
    }
    
    if (
      authHeader.includes('Bearer') &&
      authHeader.substring('Bearer'.length + 1) === 'undefined'
    ) {
      throw new AuthenticationError('No header provided')
    }
    // On récupère le token à vérifier
    const token = authHeader.includes('Bearer') ? authHeader.substring('Bearer'.length + 1) : authHeader
    // On le vérifie et on récupère le token décodé
    let payload
    try {
      payload = jwt.verify(token, '1')
    } catch (err) {
      res.json({ code: 401 })
      throw new TokenError('Expired')
    }
    // On vérifie que le token n'est pas révoqué
    // console.log(token)
    // const accessToken = await (await dbPromise).collection('accessToken').findOne({ token })
    // if (!accessToken) {
    // throw new TokenError('Revoked')
    // }

    // On vérifie que l'utilisateur existe et on le renvoit si c'est le cas
    if (!payload.userId) {
      throw new AuthenticationError('Bad header provided')
    }
    const user = await (await dbPromise).collection('user').findOne({ _id: ObjectId(payload.userId) })
    if (!user) {
      throw new NotFoundError('User not found')
    }
    req.currentUser = user._id
    return next()
  } catch (err) {
    return next(err)
  }
}

export default verifyAuthentication
