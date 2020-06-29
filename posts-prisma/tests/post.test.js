import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import seedDatabase, { userOne, postOne, postTwo } from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  getPosts,
  getMyPosts,
  createPost,
  updatePost,
  deletePost,
} from './utils/operations';

const client = getClient();

beforeAll(seedDatabase);

describe('Post', () => {
  test('should allow creating a post with token', async () => {
    const authClient = getClient(userOne.token);

    const response = await authClient.mutate({
      mutation: createPost,
      variables: {
        title: 'Created Post',
        body: 'Created Body.',
        published: true,
      },
    });

    const exists = await prisma.exists.Post({
      id: response.data.createPost.id,
      title: 'Created Post',
      body: 'Created Body.',
      published: true,
    });

    expect(exists).toBe(true);
  });

  test('should get back published posts only', async () => {
    const response = await client.query({ query: getPosts });

    expect(response.data.posts).toHaveLength(2);
    expect(response.data.posts[0].title).toBe('Published Post');
    expect(response.data.posts[0].body).toBe('A minimal body 2');
    expect(response.data.posts[0].published).toBe(true);
  });

  test('should retrieve all of my posts with token', async () => {
    const authClient = getClient(userOne.token);

    const response = await authClient.query({ query: getMyPosts });

    expect(response.data.myposts).toHaveLength(3);
  });

  test('should allow a post update with token', async () => {
    const authClient = getClient(userOne.token);

    const response = await authClient.mutate({
      mutation: updatePost,
      variables: { id: postOne.post.id, published: true },
    });

    expect(response.data.updatePost.id).toBe(postOne.post.id);
    expect(response.data.updatePost.published).toBe(true);

    const exists = await prisma.exists.Post({
      id: postOne.post.id,
      published: true,
    });

    expect(exists).toBe(true);
  });

  test('should allow deleting a post with token', async () => {
    const authClient = getClient(userOne.token);

    let exists = await prisma.exists.Post({
      id: postTwo.post.id,
      published: true,
    });
    expect(exists).toBe(true);

    await authClient.mutate({
      mutation: deletePost,
      variables: { id: postTwo.post.id },
    });

    exists = await prisma.exists.Post({ id: postTwo.post.id });
    expect(exists).toBe(false);
  });
});
