import bcrypt from 'bcryptjs';

export default {
  createUser: async (_parent, { data }, { prisma }, info) => {
    if (data.password.length < 8)
      throw new Error('Password must be at least 8 characters');

    const userData = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    };

    return prisma.mutation.createUser({ data: userData }, info);
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
