import { GraphQLServer } from 'graphql-yoga';

// Type definitions

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }

  type Query {
    me: User!
    post: Post!
  }
`;

// Resolvers

const resolvers = {
  Query: {
    me: () => ({
      id: '5478395643789265',
      name: 'Julian Nicholls',
      email: 'julian@example.com',
      // age: 47,
    }),
    post: () => ({
      id: '543789265',
      title: 'First past the post',
      body: 'A delectable body',
      published: true,
    }),
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Listening on port 4000');
});
