import { ObjectId } from 'mongodb'
import { Kind, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean, GraphQLString, GraphQLError } from 'graphql'
import { scalarType, interfaceType, arg, inputObjectType } from 'nexus'
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date'
import UnionInputType from 'graphql-union-input-type'
import { GraphQLUpload } from 'graphql-upload'
import { loadFromLoader } from 'server/dataloaders'
import GraphQLJSON from 'graphql-type-json'
/**
 *
 * @param {{
    type: NexusArgConfigType<string>;
  } & NexusArgConfig<string>} opts Options de l'Argument
 * @returns {NexusArgDef<any>}
 */
export const dateArg = (opts) => arg({ ...opts, type: 'GraphQLDateTime' })


export const Upload = scalarType({
  ...GraphQLUpload,
  asNexusMethod: 'upload'
})

const AllTypesUnionInput = UnionInputType({
  name: 'AllTypesUnionInput',
  resolveTypeFromAst: ast => {
    if (tryASTType(ast, GraphQLList)) return GraphQLList
    if (tryASTType(ast, ObjIDScalar)) return ObjIDScalar
    if (tryASTType(ast, GraphQLDate)) return GraphQLDate
    if (tryASTType(ast, GraphQLDateTime)) return GraphQLDateTime
    if (tryASTType(ast, GraphQLTime)) return GraphQLTime
    if (tryASTType(ast, GraphQLUpload)) return GraphQLUpload
    if (tryASTType(ast, GraphQLJSON)) return GraphQLJSON
    if (tryASTType(ast, GraphQLInt)) return GraphQLInt
    if (tryASTType(ast, GraphQLFloat)) return GraphQLFloat
    if (tryASTType(ast, GraphQLBoolean)) return GraphQLBoolean
    return GraphQLString
  },
  resolveTypeFromValue: value => {
    if (tryValue(value, GraphQLList)) return GraphQLList
    if (tryValue(value, ObjIDScalar)) return ObjIDScalar
    if (tryValue(value, GraphQLDate)) return GraphQLDate
    if (tryValue(value, GraphQLDateTime)) return GraphQLDateTime
    if (tryValue(value, GraphQLTime)) return GraphQLTime
    if (tryValue(value, GraphQLUpload)) return GraphQLUpload
    if (tryValue(value, GraphQLJSON)) return GraphQLJSON
    if (tryValue(value, GraphQLInt)) return GraphQLInt
    if (tryValue(value, GraphQLFloat)) return GraphQLFloat
    if (tryValue(value, GraphQLBoolean)) return GraphQLBoolean
    return GraphQLString
  }
})

export const AllTypesUnionInputScalar = scalarType({
  ...AllTypesUnionInput,
  name: 'AllTypesUnionInput',
  asNexusMethod: 'allTypesUnionInput'
})

export const GraphQLJSONScalar = scalarType({
  ...GraphQLJSON,
  name: 'GraphQLJSON',
  asNexusMethod: 'json'
})

export const GraphQLDateTimeScalar = scalarType({
  ...GraphQLDateTime,
  name: 'GraphQLDateTime',
  asNexusMethod: 'dateTime'
})
export const GraphQLDateScalar = scalarType({
  ...GraphQLDate,
  name: 'GraphQLDate',
  asNexusMethod: 'date'
})
export const GraphQLTimeScalar = scalarType({
  ...GraphQLTime,
  name: 'GraphQLTime',
  asNexusMethod: 'time'
})

export const ObjIDScalar = scalarType({
  name: 'ObjID',
  asNexusMethod: 'objID',
  description: "Scalaire pour repr??senter l'id g??n??r?? par MongoDB",
  parseValue (value) {
    if (!value) return value
    if (ObjectId.isValid(value)) return ObjectId(value)
    throw new ApolloError('ObjectId is not valid')
  },
  serialize (value) {
    return value.toString()
  },
  parseLiteral (ast) {
    const value = ast.value
    if (ast.kind === Kind.STRING) {
      if (!value) return value
      if (ObjectId.isValid(value)) return ObjectId(value)
      throw new ApolloError('ObjectId is not valid')
    }
    return null
  }
})

export const objIdArg = (opts) => arg({ ...opts, type: 'ObjID' })
export const dateTimeArg = (opts) => arg({ ...opts, type: 'GraphQLDateTime' })

export const Time = scalarType({
  name: 'Time',
  asNexusMethod: 'time',
  description: 'Time representation',
  parseValue: value => {
    if (value) {
      return /\d{2}:\d{2}/gi.test(value) ? value : null
    }
    return null
  },
  serialize: value => value.toString(),
  parseLiteral: ast => {
    if (ast.kind === Kind.STRING) {
      return /\d{2}:\d{2}/gi.test(ast.value) ? ast.value : null
    }
  }
})

export const SimpleNode = interfaceType({
  name: 'SimpleNode',
  resolveType: () => null,
  definition (t) {
    t.objID('id', {
      nullable: false,
      description: "ID unique d'un enregistrement",
      resolve: obj => obj._id
    })
  }
})

export const Node = interfaceType({
  name: 'Node',
  resolveType: () => null,
  definition (t) {
    t.objID('id', {
      nullable: false,
      description: "ID unique d'un enregistrement",
      resolve: obj => obj._id
    })
    t.dateTime('createdAt', {
      description: 'Date de cr??ation',
      nullable: false,
      resolve: obj => obj.createdAt
    })
    t.dateTime('updatedAt', {
      description: 'Derni??re date de mise ?? jour',
      nullable: false,
      resolve: obj => obj.updatedAt
    })
  }
})

export const GraphQLQueryInput = inputObjectType({
  name: 'GraphQLQueryInput',
  description: 'Input pour une requ??te graphQL',
  definition (t) {
    t.string('queryName', { description: 'Nom Query graphQL', nullable: false })
    t.list.field('variablesValues', { type: GraphQLQueryVariableValueInput, description: 'Variables requ??tes et valeurs associ??es', nullable: true, default: [] })
    t.list.field('additionalFields', { type: GraphQLQueryAdditionalFieldInput, description: 'Autres Valeurs ?? r??cup??rer pour la requ??te' })
  }
})

export const GraphQLQueryVariableValueInput = inputObjectType({
  name: 'GraphQLQueryVariableValueInput',
  description: 'Association variable / valeur graphQL',
  definition (t) {
    t.field('value', { type: GraphQLJSONScalar, description: 'Valeur Variable', nullable: true })
    t.string('localName', { description: 'Nom Local Variable', nullable: false })
    t.string('nameForQuery', { description: 'Nom Variable pour la Requ??te', nullable: false })
    t.string('type', { description: 'Type Variable', nullable: false })
  }
})

export const GraphQLQueryAdditionalFieldInput = inputObjectType({
  name: 'GraphQLQueryAdditionalFieldInput',
  description: 'Association variable / valeur ?? r??cup??rer graphQL',
  definition (t) {
    t.string('name', { description: 'Nom Champ', nullable: false })
    t.list.field('variablesValues', { type: GraphQLQueryVariableValueInput, description: 'Variables requ??tes et valeurs associ??es pour ce champ', nullable: true })
    t.list.field('fields', { type: GraphQLQueryAdditionalFieldInput, description: 'Autres Valeurs ?? r??cup??rer pour la requ??te' })
  }
})
