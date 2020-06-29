import 'cross-fetch/polyfill';

import seedDatabase, { postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  login,
  getMe,
  getMyPosts,
  updatePost,
  deletePost,
} from './utils/operations';

const client = getClient();

beforeAll(seedDatabase);

describe('Auth', () => {
  test('should log in with correct credentials', async () => {
    const response = await client.mutate({
      mutation: login,
      variables: { email: 'jennifer@example.com', password: 'Red101%#' },
    });

    expect(response.data.login.user.name).toBe('Jennifer');
    expect(response.data.login.token).toHaveLength(177);
  });

  test('should fail to log in with bad credentials', async () => {
    await expect(
      client.mutate({
        mutation: login,
        variables: { email: 'jennifer@example.com', password: 'notpassword' },
      })
    ).rejects.toThrow();
  });

  test('should not fetch user profile withOUT token set', async () => {
    await expect(client.query({ query: getMe })).rejects.toThrow();
  });

  test('should fail to retrieve my posts withOUT token', async () => {
    await expect(client.query({ query: getMyPosts })).rejects.toThrow();
  });

  test('should fail to update a post update withOUT token', async () => {
    await expect(
      client.mutate({
        mutation: updatePost,
        variables: { id: postOne.post.id, published: true },
      })
    ).rejects.toThrow();
  });

  test('should fail to delete a post withOUT token', async () => {
    await expect(
      client.mutate({ mutation: deletePost, variables: { id: postTwo.post.id } })
    ).rejects.toThrow();
  });
});
