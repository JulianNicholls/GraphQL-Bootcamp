// Root Query

import getUserIdFromAuthHeader from '../utils/getUserId';

export default {
  users: async (_parent, { query }, { prisma }, info) => {
    const pArgs = {};

    if (query) {
      pArgs.where = {
        OR: [{ name_contains: query }, { email_contains: query }],
      };
    }

    return prisma.query.users(pArgs, info);
  },
  posts: (_parent, { query }, { prisma }, info) => {
    const pArgs = {};

    if (query) {
      pArgs.where = {
        OR: [{ title_contains: query }, { body_contains: query }],
      };
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
};
