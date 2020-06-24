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
  createPost: (_parent, { data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);

    const formattedData = {
      ...data,
      author: { connect: { id: userId } },
    };

    return prisma.mutation.createPost({ data: formattedData }, info);
  },
  createComment: async (_parent, { data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);
    const okPost = await prisma.exists.Post({
      id: data.post,
      published: true,
    });

    if (!okPost) throw new Error('Only published posts can be commented on');

    const formattedData = {
      ...data,
      author: { connect: { id: userId } },
      post: { connect: { id: data.post } },
    };

    return prisma.mutation.createComment({ data: formattedData }, info);
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
  updatePost: async (_parent, { id, data }, { prisma, req }, info) => {
    const userId = getUserIdFromAuthHeader(req);
    const okPost = await prisma.exists.Post({
      id,
      author: { id: userId },
    });

    if (!okPost) throw new Error('Posts can only be updated by the author');

    const publishedPost = await prisma.exists.Post({
      id,
      published: true,
    });

    if (publishedPost && !data.published)
      await prisma.mutation.deleteManyComments({
        where: { post: { id } },
      });

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
