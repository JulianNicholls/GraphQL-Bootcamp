import bcrypt from 'bcryptjs';

import prisma from '../../src/prisma';
import createJWT from '../../src/utils/createJWT';

const userOne = {
  input: {
    name: 'Jennifer',
    email: 'jennifer@example.com',
    password: bcrypt.hashSync('Red101%#'),
  },
  user: undefined,
};

const postOne = {
  input: {
    title: 'Draft Post',
    body: 'A minimal body 1',
    published: false,
  },
};

const postTwo = {
  input: { title: 'Published Post', body: 'A minimal body 2', published: true },
};

const seedDatabase = async () => {
  // Delete previous data
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  // Create userOne and their token
  userOne.user = await prisma.mutation.createUser({ data: userOne.input });
  userOne.token = createJWT(userOne.user.id);

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
};

export { userOne, postOne, postTwo, seedDatabase as default };
