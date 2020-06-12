import { GraphQLServer } from 'graphql-yoga';

// Type definitions

const typeDefs = `
type Query {
  hello: String!
  name: String!
  location: String!
  bio: String!
}
`;

// Resolvers

const resolvers = {
  Query: {
    hello: () => 'Hello. This is my first query.',
    name: () => 'Julian',
    location: () => 'England',
    bio: () => 'A programmer for a long while',
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Listening on port 4000');
});
