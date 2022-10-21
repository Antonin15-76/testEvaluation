import { ApolloError, AuthenticationError as ApolloAuthenticationError, UserInputError as ApolloUserInputError } from 'apollo-server'

export const errorablePromiseHandler = (fn, ...params) => {
  return new Promise((resolve, reject) => {
    const asyncFn = async () => {
      try {
        const res = await fn(...params)
        resolve(res || true)
      } catch (err) {
        console.error(err)
        reject(err)
      }
    }
    return asyncFn()
  })
}

export class AuthenticationError extends ApolloAuthenticationError {
  constructor (message = 'UNAUTHENTICATED') {
    super(message, 'UNAUTHENTICATED')
    Object.defineProperty(this, 'name', { value: 'AuthenticationError' })
    this.code = 401
  }
}

export class UserInputError extends ApolloUserInputError {
  constructor (message = 'BAD_USER_INPUT', properties) {
    super(message, properties)
    Object.defineProperty(this, 'name', { value: 'UserInputError' })
    this.code = 400
  }
}

export class NotFoundError extends ApolloError {
  constructor (message = 'Resource Not Found', properties) {
    super(message, 'NOT_FOUND', properties)

    Object.defineProperty(this, 'name', { value: 'NotFoundError' })
    this.code = 404
  }
}

export class UniqueError extends ApolloError {
  constructor (message = 'Resource Not Unique', properties) {
    super(message, 'UNIQUE', properties)

    Object.defineProperty(this, 'name', { value: 'UniqueError' })
  }
}

export class HasChildrenError extends ApolloError {
  constructor (message = 'Resource Has Children', properties) {
    super(message, 'HAS_CHILDREN', properties)

    Object.defineProperty(this, 'name', { value: 'HasChildrenError' })
  }
}

export class LockedError extends ApolloError {
  constructor (message = 'Resource is Locked', properties) {
    super(message, 'LOCKED', properties)

    Object.defineProperty(this, 'name', { value: 'IsLockedError' })
  }
}

export class CreateManyError extends ApolloError {
  constructor (message, properties) {
    super(message, 'CREATE_MANY', properties)
    Object.defineProperty(this, 'name', { value: 'CreateManyErrors' })
  }
}

export class UpdateManyError extends ApolloError {
  constructor (message, properties) {
    super(message, 'UPDATE_MANY', properties)
    Object.defineProperty(this, 'name', { value: 'UpdateManyErrors' })
  }
}

export class DeleteManyError extends ApolloError {
  constructor (message, properties) {
    super(message, 'DELETE_MANY', properties)
    Object.defineProperty(this, 'name', { value: 'DeleteManyErrors' })
  }
}

export class DeleteCascadeError extends ApolloError {
  constructor (message, properties) {
    super(message, 'DELETE_CASACADE', properties)
    Object.defineProperty(this, 'name', { value: 'DeleteCascadeErrors' })
  }
}

export class GeneralError extends ApolloError {
  constructor (message = 'Internal Server Error', properties) {
    super(message, 'INTERNAL_ERROR', properties)

    Object.defineProperty(this, 'name', { value: 'GeneralError' })
  }
}

export class UnsupportedBehaviourError extends ApolloError {
  constructor (message = 'Unsupported Behaviour', properties) {
    super(message, 'UNSUPPORTED_BEHAVIOUR', properties)

    Object.defineProperty(this, 'name', { value: 'UnsupportedBehaviourError' })
  }
}

export class ImportFileHeaderError extends ApolloError {
  constructor (message = 'Import File Header', properties) {
    super(message, 'IMPORT_FILE_HEADER', properties)

    Object.defineProperty(this, 'name', { value: 'ImportFileHeader' })
  }
}
export class ExportFieldEmptyError extends ApolloError {
  constructor (message = 'No Field Selected', properties) {
    super(message, 'NO_FIELD_SELECTED', properties)
    Object.defineProperty(this, 'name', { value: 'ExportFieldEmptyError' })
  }
}

export class TokenError extends ApolloError {
  constructor (message = 'TOKEN') {
    super(message, 'TOKEN')
    this.code = 401
  }
}

export class CyclicParentError extends ApolloError {
  constructor (message = 'CYCLIC_PARENT') {
    super(message, 'CYCLIC_PARENT')
    this.code = 400
  }
}
