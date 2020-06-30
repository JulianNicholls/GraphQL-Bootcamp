// First up, install the modules necessary with the following command
// npm install apollo-client@2.4.2 apollo-cache-inmemory@1.2.10
//  apollo-link-http@1.5.5 apollo-link-error@1.1.1 apollo-link@1.2.3
//  apollo-link-ws@1.0.9 apollo-utilities@1.0.21 subscriptions-transport-ws@0.9.15
//  @babel/polyfill@7.0.0 graphql@0.13.2

import '@babel/polyfill/noConflict';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

const getClient = (
  jwt,
  httpURL = 'http://localhost:4000',
  websocketURL = 'ws://localhost:4000'
) => {
  // Setup the authorization header for the http client
  const request = async (operation) => {
    if (jwt) {
      operation.setContext({
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    }
  };

  // Setup the request handlers for the http clients
  const requestLink = new ApolloLink((operation, forward) => {
    return new Observable((observer) => {
      let handle;
      Promise.resolve(operation)
        .then((oper) => {
          request(oper);
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) {
          handle.unsubscribe();
        }
      };
    });
  });

  // Web socket link for subscriptions
  const wsLink = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }

      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    requestLink,
    new WebSocketLink({
      uri: websocketURL,
      options: {
        reconnect: true,
        connectionParams: () => {
          if (jwt) {
            return {
              Authorization: `Bearer ${jwt}`,
            };
          }
        },
      },
    }),
  ]);

  // HTTP link for queries and mutations
  const httpLink = ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
          )
        );
      }
      if (networkError) {
        console.log(`[Network error]: ${networkError}`);
      }
    }),
    requestLink,
    new HttpLink({
      uri: httpURL,
      credentials: 'same-origin',
    }),
  ]);

  // Link to direct ws and http traffic to the correct place
  const link = ApolloLink.split(
    // Pick which links get the data based on the operation kind
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query);
      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink
  );

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
};

export default getClient;
