import bcrypt from 'bcryptjs';

import getUserIdFromAuthHeader from '../utils/getUserId';
import createJWT from '../utils/createJWT';
import hashPassword from '../utils/hashPassword';

export default {
  createUser: async (_parent, { data }, { prisma }) => {
    const userData = {
      ...data,
      password: await hashPassword(data.password),
    };

    const user = await prisma.mutation.createUser({ data: userData });

    return {
      user,
      token: createJWT(user.id),
    };
  },
  login: async (_parent, { email, password }, { prisma }) => {
    const user = await prisma.query.user({ where: { email } });
    const loginOK = user && (await bcrypt.compare(password, user.password));

    if (!loginOK) throw new Error('Email address or password not recognised');

    return {
      user,
      token: createJWT(user.id),
    };
  },
  updateUser: async (_parent, { data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    if (data.password) data.password = await hashPassword(data.password);

    return prisma.mutation.updateUser(
      {
        where: { id: userId },
        data,
      },
      info
    );
  },
  deleteUser: async (_parent, _args, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    return prisma.mutation.deleteUser(
      {
        where: { id: userId },
      },
      info
    );
  },
};
