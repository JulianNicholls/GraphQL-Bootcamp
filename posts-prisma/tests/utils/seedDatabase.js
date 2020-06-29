import bcrypt from 'bcryptjs';

import prisma from '../../src/prisma';

const seedDatabase = async () => {
  await prisma.mutation.deleteManyPosts();
  await prisma.mutation.deleteManyUsers();

  const jennifer = await prisma.mutation.createUser({
    data: {
      name: 'Jennifer',
      email: 'jennifer@example.com',
      password: bcrypt.hashSync('Red101%#'),
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: 'Draft Post',
      body: 'A minimal body 1',
      published: false,
      author: { connect: { id: jennifer.id } },
    },
  });

  await prisma.mutation.createPost({
    data: {
      title: 'Published Post',
      body: 'A minimal body 2',
      published: true,
      author: { connect: { id: jennifer.id } },
    },
  });
};

export default seedDatabase;
