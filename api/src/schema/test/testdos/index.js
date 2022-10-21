
import { arg, inputObjectType, mutationField, objectType, queryField } from "nexus"
import { objIdArg } from "schema/globalNexusTypes"
import * as resolvers from "./resolvers"

export const Test = objectType({
  name: 'Test',
  definition (t) {
    t.implements('Node')
    t.string('name', { nullable: false, resolve: resolvers.nameResolve })
  }
})

// QUERIES

export const TestArgumentInput = inputObjectType({
  name: 'TestArgumentInput',
  description: 'Input des arguments pour requêter les testAttribution',
  definition (t) {
    t.int('limit', { description: 'Nombre de test à récupérer', nullable: true })
    t.int('skip', { description: "Nombre de test à passer avant d'appliquer la limite", nullable: true })
  }
})

export const testQueryField = queryField('test', {
  type: Test,
  nullable: false,
  description: 'recupérer test par ID',
  args: { id: objIdArg({ description: 'ID de Test', nullable: false }) },
  resolve: resolvers.testResolve
})

export const testsQueryField = queryField('tests', {
  list: true,
  type: Test,
  nullable: false,
  description: 'recupérer la liste des tests',
  args: { input: arg({ type: TestArgumentInput, nullable: true }) },
  resolve: resolvers.testsResolve
})

export const CreateTestInput = inputObjectType({
  name: 'CreateTestInput',
  nullable: false,
  description: 'Input de creatin de test',
  definition (t) {
    t.string('name', { nullable: false })
  }
})

export const createTestMutationField = mutationField('createTest', {
  type: Test,
  nullable: false,
  args: { input: arg({ type: CreateTestInput, nullable: true }) },
  resolve: resolvers.createTestResolve
})
