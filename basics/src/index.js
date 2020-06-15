import { GraphQLServer } from 'graphql-yoga';

// Dummy data to return
const USERS = [
  { id: '10', name: 'Julian', email: 'julian@example.com', age: 47 },
  { id: '11', name: 'Sarah', email: 'satah@example.com' },
  { id: '12', name: 'Mike', email: 'mike@example.com' },
];

const POSTS = [
  {
    id: '1',
    title: 'First post',
    body: 'This is a body',
    published: true,
    author: '10',
  },
  {
    id: '2',
    title: 'Second post',
    body: 'The body in the library',
    published: false,
    author: '10',
  },
  {
    id: '3',
    title: 'Third post',
    body: 'Ugly bodies',
    published: true,
    author: '11',
  },
];

// Type definitions
// Builtins: String, Int Float, ID, Boolean
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
    author: User!
  }

  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
  }
`;

// Resolvers
const resolvers = {
  Post: {
    author: ({ author }) => {
      return USERS.find(({ id }) => author === id);
    },
  },
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
    users: (_parent, args) => {
      if (!args.query) return USERS;

      const query = args.query.toLocaleLowerCase();

      return USERS.filter(({ name }) => name.toLocaleLowerCase().includes(query));
    },
    posts: (_parent, args) => {
      if (!args.query) return POSTS;

      const query = args.query.toLocaleLowerCase();

      return POSTS.filter(
        ({ title, body }) =>
          title.toLocaleLowerCase().includes(query) ||
          body.toLocaleLowerCase().includes(query)
      );
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log('Listening on port 4000');
});
