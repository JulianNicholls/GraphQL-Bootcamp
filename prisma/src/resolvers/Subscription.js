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
};
