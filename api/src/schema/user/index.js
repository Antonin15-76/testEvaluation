
import { arg, inputObjectType, mutationField, objectType, queryField } from "nexus"
import { objIdArg } from "schema/globalNexusTypes"
import * as resolvers from "./resolvers"

export const User = objectType({
  name: 'User',
  definition (t) {
    t.implements('Node')
    t.string('pseudo', { nullable: false, resolve: resolvers.nameResolve })
    t.string('password', { nullable: false, resolve: resolvers.passwordResolve })
    t.string('userType', { nullable: false, resolve: resolvers.userTypeResolve })
    t.boolean('isActif', { nullable: false, resolve: resolvers.isActifResolve })
  }
})

// QUERIES

export const UserArgumentInput = inputObjectType({
  name: 'UserArgumentInput',
  description: 'Input des arguments pour requêter les userAttribution',
  definition (t) {
    t.int('limit', { description: 'Nombre de user à récupérer', nullable: true })
    t.int('skip', { description: "Nombre de user à passer avant d'appliquer la limite", nullable: true })
  }
})

export const userQueryField = queryField('user', {
  type: User,
  nullable: false,
  description: 'recupérer user par ID',
  args: { id: objIdArg({ description: 'ID de User', nullable: false }) },
  resolve: resolvers.userResolve
})

export const usersQueryField = queryField('users', {
  list: true,
  type: User,
  nullable: false,
  description: 'recupérer la liste des users',
  args: { input: arg({ type: UserArgumentInput, nullable: true }) },
  resolve: resolvers.usersResolve
})

// MUTATION

export const CreateUserInput = inputObjectType({
  name: 'CreateUserInput',
  nullable: false,
  description: 'Input de creation de user',
  definition (t) {
    t.string('pseudo', { nullable: false })
    t.string('password', { nullable: false })
    t.string('userType', { nullable: false, default: 'NORMAL' })
    t.boolean('isActif', { nullable: false, default: true })
  }
})

export const createUserMutationField = mutationField('createUser', {
  type: User,
  nullable: false,
  args: { input: arg({ type: CreateUserInput, nullable: true }) },
  resolve: resolvers.createUserResolve
})

// UPDATE

export const UpdateUserInput = inputObjectType({
  name: 'UpdateUserInput',
  nullable: false,
  description: 'Input de modification user',
  definition (t) {
    t.string('pseudo', { nullable: true })
    t.string('password', { nullable: true })
    t.string('userType', { nullable: true })
    t.boolean('isActif', { nullable: true })
  }
})

export const updateUserMutationField = mutationField('updateUser', {
  type: User,
  nullable: false,
  args: { id: objIdArg({ description: 'ID de User', nullable: false }) , input: arg({ type: UpdateUserInput, nullable: true }) },
  resolve: resolvers.updateUserResolve
})

// export const desactiveUserMutationField = mutationField('desactiveUser', {
//   type: User,
//   nullable: false,
//   args: { input: arg({ type: UpdateUserInput, nullable: true }) },
//   resolve: resolvers.desactiveUserResolve
// })