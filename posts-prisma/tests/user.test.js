import 'cross-fetch/polyfill';
import ApolloBoost, { gql } from 'apollo-boost';

import prisma from '../src/prisma';

const client = new ApolloBoost({
  uri: 'http://localhost:4000',
});

describe('User', () => {
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
    const exists = await prisma.exists.User({ name: 'Julian' });

    expect(exists).toBe(true);
  });
});
