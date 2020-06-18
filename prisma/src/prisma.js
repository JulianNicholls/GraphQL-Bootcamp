import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

// prisma.query / mutation / subscription
// prisma.exists

// console.log('Creating Post...');
// prisma.mutation
//   .createPost(
//     {
//       data: {
//         title: 'This is a fourth post',
//         body: 'Another body by Andrew goes here',
//         published: true,
//         author: {
//           connect: { id: 'ckbkjb0b7005e0737mnklxlp1' },
//         },
//       },
//     },
//     '{ id title body published author { name }}'
//   )

prisma.mutation
  .updatePost(
    {
      data: {
        title: "Actually, it's the fifth post",
        body: 'A fit body for this post',
      },
      where: { id: 'ckbkshzyn000q0737v5cq0u9l' },
    },
    '{ id title body }'
  )
  .then((data) => {
    console.log(JSON.stringify(data, undefined, 2));

    return prisma.query.posts(null, '{ id title body published author { name }}');
  })
  .then((data) => {
    console.log('\nUSERS');
    console.log(JSON.stringify(data, undefined, 2));
  });

// prisma.query.users(null, '{ id name email posts { title }}').then((data) => {
//   console.log('\nUSERS');
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query.posts(null, '{ id title author { name }}').then((data) => {
//   console.log('\nPOSTS');
//   console.log(JSON.stringify(data, undefined, 2));
// });

// prisma.query
//   .comments(null, '{ id text author { name } post { title }}')
//   .then((data) => {
//     console.log('\nCOMMENTS');
//     console.log(JSON.stringify(data, undefined, 2));
//   });
