import { GraphQLServer } from 'graphql-yoga';

import prisma from './prisma';
import { resolvers, fragmentReplacements } from './resolvers';

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

export default server;
