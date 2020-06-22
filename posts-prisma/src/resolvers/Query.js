// Root Query

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
};
