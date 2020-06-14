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
    greeting(name: String): String!
    add(a: Float!, b: Float!): Float!
    grades: [Int!]!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    me: () => ({
      id: '5478395643789265',
      name: 'Julian Nicholls',
      email: 'julian@example.com',
      age: 47,
    }),
    post: () => ({
      id: '543789265',
      title: 'First past the post',
      body: 'A delectable body',
      published: true,
    }),

    greeting: (_parent, args /*,  context, info */) => {
      const name = args.name ? args.name : 'to you';

      return `Hello ${name}`;
    },
    add: (_parent, { a, b }) => a + b,
    grades: () => [99, 80, 93],
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Listening on port 4000');
});
