import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'secret';

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
  createPost: (_parent, { data }, { prisma }, info) => {
    const formattedData = {
      ...data,
      author: { connect: { id: data.author } },
    };

    return prisma.mutation.createPost({ data: formattedData }, info);
  },
  createComment: (_parent, { data }, { prisma }, info) => {
    const formattedData = {
      ...data,
      author: { connect: { id: data.author } },
      post: { connect: { id: data.post } },
    };

    return prisma.mutation.createComment({ data: formattedData }, info);
  },
  updateUser: (_parent, { id, data }, { prisma }, info) =>
    prisma.mutation.updateUser(
      {
        where: { id },
        data,
      },
      info
    ),
  updatePost: (_parent, { id, data }, { prisma }, info) =>
    prisma.mutation.updatePost(
      {
        where: { id },
        data,
      },
      info
    ),
  updateComment: (_parent, { id, data }, { prisma }, info) =>
    prisma.mutation.updateComment(
      {
        where: { id },
        data,
      },
      info
    ),
  deleteUser: async (_parent, { id }, { prisma }, info) =>
    prisma.mutation.deleteUser({ where: { id } }, info),
  deletePost: (_parent, { id }, { prisma }, info) =>
    prisma.mutation.deletePost({ where: { id } }, info),
  deleteComment: (_parent, { id }, { prisma }, info) =>
    prisma.mutation.deleteComment({ where: { id } }, info),
};
