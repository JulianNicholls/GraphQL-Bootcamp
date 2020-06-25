import '@babel/polyfill/noConflict';
import { GraphQLServer } from 'graphql-yoga';

import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers';

const port = process.env.PORT || 4000;

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      prisma,
      req: request,
    };
  },
  fragmentReplacements,
});

server.start({ port }, () => {
  console.log('GraphQL server listening on port', port);
});
