import 'cross-fetch/polyfill';

import prisma from '../src/prisma';
import seedDatabase, {
  userOne,
  userTwo,
  commentOne,
  commentTwo,
  postTwo,
} from './utils/seedDatabase';
import getClient from './utils/getClient';
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  subscribeToComments,
} from './utils/operations';

const client = getClient();

beforeAll(seedDatabase);

describe('Comment', () => {
  test('should create a new comment', async () => {
    const authClient = getClient(userOne.token);

    const response = await authClient.mutate({
      mutation: createComment,
      variables: {
        text: 'A third comment',
        post: postTwo.post.id,
      },
    });

    const exists = await prisma.exists.Comment({
      id: response.data.createComment.id,
      text: 'A third comment',
    });

    expect(exists).toBe(true);
  });

  test('should retrieve all comments', async () => {
    const response = await client.query({ query: getComments });

    expect(response.data.comments).toHaveLength(3);
    expect(response.data.comments[0].text).toBe('A comment from Andrew');
  });

  test('should allow updating author comments', async () => {
    const authClient = getClient(userOne.token);

    await authClient.mutate({
      mutation: updateComment,
      variables: {
        id: commentTwo.comment.id,
        text: 'Updated Jennifer comment',
      },
    });

    const exists = await prisma.exists.Comment({
      id: commentTwo.comment.id,
      text: 'Updated Jennifer comment',
    });

    expect(exists).toBe(true);
  });

  test('should NOT allow updating of other user comments', async () => {
    const authClient = getClient(userOne.token);

    await expect(
      authClient.mutate({
        mutation: updateComment,
        variables: {
          id: commentOne.comment.id,
          text: 'Updated Andrew comment',
        },
      })
    ).rejects.toThrow();
  });

  test('should allow deleting of author comments', async () => {
    const authClient = getClient(userTwo.token);

    let exists = await prisma.exists.Comment({ id: commentOne.comment.id });
    expect(exists).toBe(true);

    await authClient.mutate({
      mutation: deleteComment,
      variables: { id: commentOne.comment.id },
    });

    exists = await prisma.exists.Comment({ id: commentOne.comment.id });
    expect(exists).toBe(false);
  });

  test('should NOT allow deleting of other user comments', async () => {
    const authClient = getClient(userTwo.token);

    await expect(
      authClient.mutate({
        mutation: deleteComment,
        variables: { id: commentTwo.comment.id },
      })
    ).rejects.toThrow();
  });

  test('should subscribe to comments for a post', async (done) => {
    client
      .subscribe({
        query: subscribeToComments,
        variables: { postId: postTwo.post.id },
      })
      .subscribe({
        next: (response) => {
          expect(response.data.comment.mutation).toBe('UPDATED');
          expect(response.data.comment.node.id).toBe(commentTwo.comment.id);

          done();
        },
      });

    // Change a comment to fire the subscription
    await prisma.mutation.updateComment({
      where: { id: commentTwo.comment.id },
      data: { text: 'Update for subscription' },
    });
  });
});
