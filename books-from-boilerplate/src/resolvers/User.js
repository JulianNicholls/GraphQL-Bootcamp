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
};
