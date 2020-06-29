import bcrypt from 'bcryptjs';

import prisma from '../../src/prisma';
import createJWT from '../../src/utils/createJWT';

const userOne = {
  input: {
    name: 'Jennifer',
    email: 'jennifer@example.com',
    password: bcrypt.hashSync('Red101%#'),
  },
};

const userTwo = {
  input: {
    name: 'Andrew',
    email: 'andrew@example.com',
    password: bcrypt.hashSync('Blue202#$'),
  },
};

const postOne = {
  input: { title: 'Draft Post', body: 'A minimal body 1', published: false },
};

const postTwo = {
  input: { title: 'Published Post', body: 'A minimal body 2', published: true },
};

const commentOne = {
  input: { text: 'A comment from Andrew' },
};

const commentTwo = {
  input: { text: 'A comment from Jennifer' },
};

const seedDatabase = async () => {
  // Delete previous data
  await prisma.mutation.deleteManyComments();
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create userOne and their token
  userOne.user = await prisma.mutation.createUser({ data: userOne.input });
  userOne.token = createJWT(userOne.user.id);

  // Create userOne and their token
  userTwo.user = await prisma.mutation.createUser({ data: userTwo.input });
  userTwo.token = createJWT(userTwo.user.id);

  // Create and store postOne
  postOne.post = await prisma.mutation.createPost({
    data: {
      ...postOne.input,
      author: {
        connect: { id: userOne.user.id },
      },
    },
  });

  // Create and store postTwo
  postTwo.post = await prisma.mutation.createPost({
    data: {
      ...postTwo.input,
      author: {
        connect: { id: userOne.user.id },
      },
    },
  });

  // Create and store commentOne
  commentOne.comment = await prisma.mutation.createComment({
    data: {
      ...commentOne.input,
      post: {
        connect: { id: postTwo.post.id },
      },
      author: {
        connect: { id: userTwo.user.id },
      },
    },
  });

  // Create and store commentOne
  commentTwo.comment = await prisma.mutation.createComment({
    data: {
      ...commentTwo.input,
      post: {
        connect: { id: postTwo.post.id },
      },
      author: {
        connect: { id: userOne.user.id },
      },
    },
  });
};

export {
  userOne,
  userTwo,
  postOne,
  postTwo,
  commentOne,
  commentTwo,
  seedDatabase as default,
};
