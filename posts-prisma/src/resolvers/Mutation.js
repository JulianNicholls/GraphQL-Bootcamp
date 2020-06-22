export default {
  createUser: (_parent, { data }, { prisma }, info) =>
    prisma.mutation.createUser({ data }, info),
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
