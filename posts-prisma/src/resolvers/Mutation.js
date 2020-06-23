import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import getUserIdFromAuthHeader from '../utils/getUserId';

const JWT_SECRET = 'secret'; // for now

export default {
  createUser: async (_parent, { data }, { prisma }) => {
    if (data.password.length < 8)
      throw new Error('Password must be at least 8 characters');

    const userData = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    };

    const user = await prisma.mutation.createUser({ data: userData });

    return {
      user,
      token: jwt.sign({ userId: user.id }, JWT_SECRET),
    };
  },
  login: async (_parent, { email, password }, { prisma }) => {
    const user = await prisma.query.user({ where: { email } });
    const loginOK = user && (await bcrypt.compare(password, user.password));

    if (!loginOK) throw new Error('Email address or password not recognised');

    return {
      user,
      token: jwt.sign({ userId: user.id }, JWT_SECRET),
    };
  },
  createPost: (_parent, { data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    const formattedData = {
      ...data,
      author: { connect: { id: userId } },
    };

    return prisma.mutation.createPost({ data: formattedData }, info);
  },
  createComment: (_parent, { data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    const formattedData = {
      ...data,
      author: { connect: { id: userId } },
      post: { connect: { id: data.post } },
    };

    return prisma.mutation.createComment({ data: formattedData }, info);
  },
  updateUser: (_parent, { data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    return prisma.mutation.updateUser(
      {
        where: { id: userId },
        data,
      },
      info
    );
  },
  updatePost: async (_parent, { id, data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);
    const okPost = await prisma.exists.Post({
      id,
      author: { id: userId },
    });

    if (!okPost) throw new Error('Posts can only be updated by the author');

    return prisma.mutation.updatePost(
      {
        where: { id },
        data,
      },
      info
    );
  },
  updateComment: async (_parent, { id, data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);
    const okComment = await prisma.exists.Comment({
      id,
      author: { id: userId },
    });

    if (!okComment) throw new Error('Comments can only be updated by the author');

    return prisma.mutation.updateComment(
      {
        where: { id },
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
  deletePost: async (_parent, { id }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);
    const okPost = await prisma.exists.Post({
      id,
      author: { id: userId },
    });

    if (!okPost) throw new Error('Posts can only be deleted by the author');

    return prisma.mutation.deletePost({ where: { id } }, info);
  },
  deleteComment: async (_parent, { id }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);
    const okComment = await prisma.exists.Comment({
      id,
      author: { id: userId },
    });

    if (!okComment) throw new Error('Comments can only be deleted by the author');

    return prisma.mutation.deleteComment({ where: { id } }, info);
  },
};
