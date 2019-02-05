import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import { setContext } from 'apollo-link-context'

import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { AUTH_TOKEN, SERVER } from './constants'

const wsLink = new WebSocketLink({
  uri: `ws://${SERVER}`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN),
    }
  }
})

const httpLink = createHttpLink({
  uri: `http://${SERVER}` // server
})

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const link = split( // is used to “route” a request to a specific middleware link ( second element OR third element )
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  }, // if true -> second element : third element
  wsLink,
  authLink.concat(httpLink)
)

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
})