import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from 'bcryptjs';

import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000',
});

beforeAll(async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  const jennifer = await prisma.mutation.createUser({
    data: {
      name: 'Jennifer',
      email: 'jennifer@example.com',
      password: bcrypt.hashSync('Red101%#'),
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: 'Draft Post',
      body: 'A minimal body 1',
      published: false,
      author: { connect: { id: jennifer.id } },
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: 'Published Post',
      body: 'A minimal body 2',
      published: true,
      author: { connect: { id: jennifer.id } },
    },
  });
});

describe('User', () => {
  test('should create a new user with good credentials', async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            name: "Julian"
            email: "julian@example.com"
            password: "password"
          }
        ) {
          token
        }
      }
    `;

    await client.mutate({ mutation: createUser });
    const exists = await prisma.exists.User({
      name: 'Julian',
      email: 'julian@example.com',
    });

    expect(exists).toBe(true);
  });

  test('should not create a new user with bad credentials', async () => {
    const createUserBad = gql`
      mutation {
        createUser(
          data: {
            name: "Julian"
            email: "julian_n@example.com"
            password: "pass" # Too short
          }
        ) {
          token
        }
      }
    `;

    await expect(client.mutate({ mutation: createUserBad })).rejects.toThrow();
  });

  test('should expose only public author items', async () => {
    const getAuthors = gql`
      query {
        users {
          id
          name
          email
        }
      }
    `;

    const response = await client.query({ query: getAuthors });

    expect(response.data.users).toHaveLength(2);
    expect(response.data.users[0].email).toBeNull();
  });

  test('should log in with correct credentials', async () => {
    const login = gql`
      mutation {
        login(email: "jennifer@example.com", password: "Red101%#") {
          user {
            name
          }
          token
        }
      }
    `;

    const response = await client.mutate({ mutation: login });

    expect(response.data.login.user.name).toBe('Jennifer');
    expect(response.data.login.token).toHaveLength(177);
  });

  test('should fail to log in with bad credentials', async () => {
    const loginBad = gql`
      mutation {
        login(email: "jennifer@example.com", password: "notpassword") {
          token
        }
      }
    `;

    await expect(client.mutate({ mutation: loginBad })).rejects.toThrow();
  });
});

describe('Post', () => {
  test('should get back published posts only', async () => {
    const getPosts = gql`
      query {
        posts {
          title
          body
          published
        }
      }
    `;

    const response = await client.query({ query: getPosts });

    expect(response.data.posts).toHaveLength(1);
    expect(response.data.posts[0].title).toBe('Published Post');
    expect(response.data.posts[0].body).toBe('A minimal body 2');
    expect(response.data.posts[0].published).toBe(true);
  });
});
