import { ApolloClient, InMemoryCache, NormalizedCacheObject, ApolloProvider, gql } from '@apollo/client';

export type Client = ApolloClient<NormalizedCacheObject>

export const create = (): Client => new ApolloClient({
  uri: 'http://localhost:8081',
  cache: new InMemoryCache()
});