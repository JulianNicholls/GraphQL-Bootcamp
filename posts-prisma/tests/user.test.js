import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';
import seedDatabase from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeAll(seedDatabase);

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
