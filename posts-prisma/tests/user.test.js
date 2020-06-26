import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';
import bcrypt from 'bcryptjs';

import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000',
});

describe('User', () => {
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

  test('should create a new user', async () => {
    const createUser = gql`
      mutation {
        createUser(
          data: {
            name: "Julian"
            email: "julian@example.com"
            password: "password"
          }
        ) {
          user {
            id
            name
            email
          }
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
});
