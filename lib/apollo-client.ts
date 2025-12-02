import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Rick and Morty GraphQL API endpoint.
 * @see https://rickandmortyapi.com/documentation/#graphql
 */
const RICK_AND_MORTY_API = "https://rickandmortyapi.com/graphql";

/**
 * Creates and configures the Apollo Client instance.
 * Uses InMemoryCache for client-side caching of GraphQL responses.
 */
function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: RICK_AND_MORTY_API,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        // Fetch from cache first, then network for fresh data
        fetchPolicy: "cache-and-network",
      },
    },
  });
}

// Singleton instance for client-side usage
let apolloClient: ApolloClient | null = null;

/**
 * Returns the Apollo Client instance.
 * Creates a new instance if one doesn't exist (singleton pattern).
 */
export function getApolloClient() {
  if (!apolloClient) {
    apolloClient = createApolloClient();
  }
  return apolloClient;
}
