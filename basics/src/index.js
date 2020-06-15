import { GraphQLServer } from 'graphql-yoga';
import { v4 as uuid } from 'uuid';

// Dummy data to return
const USERS = [
  {
    id: '10',
    name: 'Julian',
    email: 'julian@example.com',
    age: 47,
  },
  { id: '11', name: 'Sarah', email: 'sarah@example.com' },
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

const COMMENTS = [
  { id: '21', text: 'First comment', post: '1', author: '12' },
  { id: '22', text: 'Great post', post: '1', author: '11' },
  { id: '23', text: 'This stinks', post: '2', author: '12' },
  { id: '24', text: 'What a crock', post: '3', author: '10' },
];

// Type definitions
// Builtins: String, Int Float, ID, Boolean
const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }

  type Query {
    me: User!
    post: Post!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!
    createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
    createComment(text: String!, author: ID!, post: ID!): Comment!
  }
`;

// Resolvers
const resolvers = {
  Post: {
    author: ({ author }) => USERS.find(({ id }) => author === id),
    comments: ({ id }) => COMMENTS.filter(({ post }) => post === id),
  },
  User: {
    posts: ({ id }) => POSTS.filter(({ author }) => author === id),
    comments: ({ id }) => COMMENTS.filter(({ author }) => author === id),
  },
  Comment: {
    author: ({ author }) => USERS.find(({ id }) => author === id),
    post: ({ post }) => POSTS.find(({ id }) => post === id),
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
    comments: () => COMMENTS,
  },
  Mutation: {
    createUser: (_parent, { name, email, age }) => {
      const dup = USERS.some((user) => user.email === email);

      if (dup) throw new Error('Email address is already in use.');

      const newUser = {
        id: uuid(),
        name,
        email,
        age,
      };

      USERS.push(newUser);

      return newUser;
    },
    createPost: (_parent, { title, body, published, author }) => {
      const userFound = USERS.some(({ id }) => id === author);

      if (!userFound) throw new Error('Author is not recognised');

      const newPost = {
        id: uuid(),
        title,
        body,
        published,
        author,
      };

      POSTS.push(newPost);

      return newPost;
    },
    createComment: (_parent, { text, author, post }) => {
      const userFound = USERS.some(({ id }) => id === author);
      const postFound = POSTS.some(
        ({ id, published }) => id === post && published
      );

      if (!userFound) throw new Error('Author is not recognised');
      if (!postFound) throw new Error('Post is not a published post');

      const newComment = {
        id: uuid(),
        text,
        author,
        post,
      };

      COMMENTS.push(newComment);

      return newComment;
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
