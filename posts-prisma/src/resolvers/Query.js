// Root Query

import getUserIdFromAuthHeader from '../utils/getUserId';

export default {
  users: async (_parent, { query, first, skip }, { prisma }, info) => {
    const pArgs = {
      first,
      skip,
    };

    if (query) {
      pArgs.where = {
        OR: [{ name_contains: query }],
      };
    }

    return prisma.query.users(pArgs, info);
  },
  posts: (_parent, { query, first, skip }, { prisma }, info) => {
    const pArgs = {
      first,
      skip,
      where: { published: true },
    };

    if (query) {
      pArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
    }

    return prisma.query.posts(pArgs, info);
  },
  comments: (_parent, _args, { prisma }, info) => {
    return prisma.query.comments(null, info);
  },
  post: async (_parent, { id }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req, false);
    const posts = await prisma.query.posts(
      {
        where: {
          id,
          OR: [{ published: true }, { author: { id: userId } }],
        },
      },
      info
    );

    if (posts.length === 0) throw new Error('Post not found');

    return posts[0];
  },
  me: async (_parent, _args, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    return prisma.query.user({ where: { id: userId } }, info);
  },
  myposts: (_parent, { query }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    const pArgs = {
      where: {
        author: { id: userId },
      },
    };

    if (query) {
      pArgs.where.OR = [{ title_contains: query }, { body_contains: query }];
    }

    return prisma.query.posts(pArgs, info);
  },
};
