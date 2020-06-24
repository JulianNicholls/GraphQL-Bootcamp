import getUserIdFromAuthHeader from '../utils/getUserId';

export default {
  email: {
    fragment: 'fragment getID on User { id }',
    resolve: (parent, _args, { req }) => {
      const userId = getUserIdFromAuthHeader(req, false);

      if (userId && userId === parent.id) return parent.email;

      return null;
    },
  },
  posts: {
    fragment: 'fragment getID on User { id }',
    resolve: async (parent, _args, { prisma }, info) => {
      return prisma.query.posts(
        {
          where: {
            author: { id: parent.id },
            published: true,
          },
        },
        info
      );
    },
  },
};
