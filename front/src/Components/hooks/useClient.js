import { ApolloClient, InMemoryCache, split } from '@apollo/client'
import { useMemo } from 'react'
import { WebSocketLink } from '@apollo/client/link/ws'
import { getMainDefinition } from '@apollo/client/utilities'
import { createUploadLink } from 'apollo-upload-client'
import { DateTime } from 'luxon'

const useClient = accessToken => useMemo(() => {
  const httpLink = createUploadLink({
    uri: `http://localhost:3001/graphql`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      TimeZone: DateTime.local().zoneName,
      locale: DateTime.local().locale
    }
  })
  const wsLink = new WebSocketLink({
    uri: `ws://localhost:3001/subscriptions`,
    options: {
      reconnect: true,
      connectionParams: {
        token: accessToken
      }
    }
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  return new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache({
      typePolicies: {
        User: {
          fields: {
            roles: {
              merge (existing = [], incoming) {
                return [...incoming]
              }
            }
          }
        }
      }
    }),
    defaultOptions: {
      watchQuery: { notifyOnNetworkStatusChange: true },
      query: { notifyOnNetworkStatusChange: true }
    }
  })
}, [accessToken])

export default useClient
