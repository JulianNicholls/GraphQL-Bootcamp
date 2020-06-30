// Root Query

import getUserIdFromAuthHeader from '../utils/getUserId';

export default {
  users: async (
    _parent,
    { query, first, skip, after, orderBy },
    { prisma },
    info
  ) => {
    const pArgs = {
      first,
      skip,
      after,
      orderBy,
    };

    if (query) {
      pArgs.where = {
        OR: [{ name_contains: query }],
      };
    }

    return prisma.query.users(pArgs, info);
  },
  me: async (_parent, _args, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    return prisma.query.user({ where: { id: userId } }, info);
  },
};
