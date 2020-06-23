import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

///////////////////////////////////////////////////////////
// const secret = 'ghdehreup';
// const token = jwt.sign({ id: '46' }, secret);
// console.log({ token });

// const decoded = jwt.decode(token);
// console.log({ decoded });

// const verified = jwt.verify(token, secret);
// console.log({ verified });

// try {
//   const unverified = jwt.verify(token, secret + 'x');
//   console.log({ unverified });
// } catch (err) {
//   console.log('Verify failed');
//   console.error({ name: err.name, message: err.message });
// }
///////////////////////////////////////////////////////////

export default {
  createUser: async (_parent, { data }, { prisma }, info) => {
    if (data.password.length < 8)
      throw new Error('Password must be at least 8 characters');

    const userData = {
      ...data,
      password: await bcrypt.hash(data.password, 10),
    };

    const user = await prisma.mutation.createUser({ data: userData });

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'secret'),
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
