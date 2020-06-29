import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import seedDatabase, { userOne } from './utils/seedDatabase';
import getClient from './utils/getClient';
import { getUsers, getMe, createUser } from './utils/operations';

const client = getClient();

beforeAll(seedDatabase);

describe('User', () => {
  test('should create a new user with good credentials', async () => {
    await client.mutate({
      mutation: createUser,
      variables: {
        name: 'Julian',
        email: 'julian@example.com',
        password: 'password',
      },
    });

    const exists = await prisma.exists.User({
      name: 'Julian',
      email: 'julian@example.com',
    });

    expect(exists).toBe(true);
  });

  test('should not create a new user with bad credentials', async () => {
    await expect(
      client.mutate({
        mutation: createUser,
        variables: {
          name: 'Julian',
          email: 'julian@example.com',
          password: 'pass', // Too short
        },
      })
    ).rejects.toThrow();
  });

  test('should expose only public author items', async () => {
    const response = await client.query({ query: getUsers });

    expect(response.data.users).toHaveLength(2);
    expect(response.data.users[0].email).toBeNull();
  });

  test('should fetch user profile with token set', async () => {
    const authClient = getClient(userOne.token);

    const response = await authClient.query({ query: getMe });

    expect(response.data.me.id).toBe(userOne.user.id);
    expect(response.data.me.name).toBe(userOne.user.name);
    expect(response.data.me.email).toBe(userOne.user.email);
  });
});
