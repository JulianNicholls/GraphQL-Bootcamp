import getUserIdFromAuthHeader from '../utils/getUserId';

export default {
  comment: {
    subscribe: (_parent, { postId }, { prisma }, info) =>
      prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: postId,
              },
            },
          },
        },
        info
      ),
  },
  post: {
    subscribe: (_parent, _args, { prisma }, info) =>
      prisma.subscription.post(
        {
          where: {
            node: {
              published: true,
            },
          },
        },
        info
      ),
  },
  mypost: {
    subscribe: async (_parent, _args, { prisma, req }, info) => {
      const userId = getUserIdFromAuthHeader(req);

      return prisma.subscription.post(
        {
          where: {
            node: {
              author: {
                id: userId,
              },
            },
          },
        },
        info
      );
    },
  },
};
