// Root Query

export default {
  users: async (_parent, args, { prisma }, info) => {
    const pArgs = {};

    if (args.query) {
      pArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }],
      };
    }

    return prisma.query.users(pArgs, info);
  },
  posts: (_parent, args, { prisma }, info) => {
    const pArgs = {};

    if (args.query) {
      pArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }],
      };
    }

    return prisma.query.posts(pArgs, info);
  },
  comments: (_parent, _args, { prisma }, info) => {
    return prisma.query.comments(null, info);
  },
};
