// Root Query

export default {
  users: async (_parent, args, { prisma }, info) => {
    return prisma.query.users(null, info);
  },
  posts: (_parent, args, { prisma }, info) => {
    return prisma.query.posts(null, info);
  },
  comments: (_parent, _args, { prisma }, info) => {
    return prisma.query.comments(null, info);
  },
};
