import { gql } from "graphql-tag"

export const updateUser = gql`mutation updateUser($id: ObjID, $input: UpdateUserInput){
    updateUser(input: $input, id: $id) {
        id
    }
}`

export const users = gql`query users($input: UserArgumentInput){
    users(input: $input) {
        id
        pseudo
    }
}`
