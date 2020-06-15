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

let POSTS = [
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

let COMMENTS = [
  { id: '21', text: 'First comment', post: '1', author: '12' },
  { id: '22', text: 'Great post', post: '1', author: '11' },
  { id: '23', text: 'This stinks', post: '2', author: '12' },
  { id: '24', text: 'What a crock', post: '3', author: '10' },
  { id: '25', text: 'Untouchable', post: '3', author: '12' },
  { id: '26', text: 'A final one to delete', post: '3', author: '11' },
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

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    post: ID!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!

    deleteUser(id: ID!): User!
    deletePost(id: ID!): Post!
    deleteComment(id: ID!): Comment!
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
    createUser: (_parent, { data }) => {
      const dup = USERS.some(({ email }) => email === data.email);

      if (dup) throw new Error('Email address is already in use.');

      const newUser = { id: uuid(), ...data };

      USERS.push(newUser);

      return newUser;
    },
    createPost: (_parent, { data }) => {
      const userFound = USERS.some(({ id }) => id === data.author);

      if (!userFound) throw new Error('Author is not recognised');

      const newPost = { id: uuid(), ...data };

      POSTS.push(newPost);

      return newPost;
    },
    createComment: (_parent, { data }) => {
      const userFound = USERS.some(({ id }) => id === data.author);
      const postFound = POSTS.some(
        ({ id, published }) => id === data.post && published
      );

      if (!userFound) throw new Error('Author is not recognised');
      if (!postFound) throw new Error('Post is not a published post');

      const newComment = { id: uuid(), ...data };

      COMMENTS.push(newComment);

      return newComment;
    },
    deleteUser: (_parent, args) => {
      const userIndex = USERS.findIndex(({ id }) => id === args.id);

      if (userIndex === -1) throw new Error('User is not recognised');

      const [user] = USERS.splice(userIndex, 1);

      POSTS = POSTS.filter((post) => {
        if (post.author !== user.id) return true;

        COMMENTS = COMMENTS.filter((comment) => comment.post !== post.id);

        return false;
      });

      COMMENTS = COMMENTS.filter(({ author }) => author !== user.id);

      return user;
    },
    deletePost: (_post, args) => {
      const postIndex = POSTS.findIndex(({ id }) => id === args.id);

      if (postIndex === -1) throw new Error('Post is not recognised');

      const [post] = POSTS.splice(postIndex, 1);

      COMMENTS = COMMENTS.filter((comment) => comment.post !== post.id);

      return post;
    },
    deleteComment: (_parent, args) => {
      const commentIndex = COMMENTS.findIndex(({ id }) => id === args.id);

      if (commentIndex === -1) throw new Error('Comment is not recognised');

      const [comment] = COMMENTS.splice(commentIndex, 1);

      return comment;
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
