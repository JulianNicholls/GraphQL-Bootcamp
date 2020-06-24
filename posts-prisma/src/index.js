import { GraphQLServer, PubSub } from 'graphql-yoga';

import db from './db';
import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers';

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (request) => {
    return {
      db,
      pubsub,
      prisma,
      req: request,
    };
  },
  fragmentReplacements,
});

server.start(() => {
  console.log('GraphQL server listening on port 4000');
});
