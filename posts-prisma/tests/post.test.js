import 'cross-fetch/polyfill';
import { gql } from 'apollo-boost';

import prisma from '../src/prisma';
import seedDatabase from './utils/seedDatabase';
import getClient from './utils/getClient';

const client = getClient();

beforeAll(seedDatabase);

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
