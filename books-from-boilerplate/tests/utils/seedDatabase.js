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

const seedDatabase = async () => {
  // Delete previous data
  await prisma.mutation.deleteManyUsers();

  // Create userOne and their token
  userOne.user = await prisma.mutation.createUser({ data: userOne.input });
  userOne.token = createJWT(userOne.user.id);

  // Create userOne and their token
  userTwo.user = await prisma.mutation.createUser({ data: userTwo.input });
  userTwo.token = createJWT(userTwo.user.id);
};

export { userOne, userTwo, seedDatabase as default };
