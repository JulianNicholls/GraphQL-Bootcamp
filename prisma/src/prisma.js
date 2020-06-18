import { Prisma } from 'prisma-binding';

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
});

const showUsers = async () => {
  const users = await prisma.query.users(
    null,
    '{ id name email posts { id title }}'
  );

  console.log('\nUSERS');
  console.log(JSON.stringify(users, undefined, 2));
};

const showPosts = async () => {
  const posts = await prisma.query.posts(
    null,
    '{ id title body published author { name }}'
  );

  console.log('\nPOSTS');
  console.log(JSON.stringify(posts, undefined, 2));
};

const showComments = async () => {
  const comments = await prisma.query.comments(
    null,
    '{ id text author { id name } post { id title }}'
  );

  console.log('\nCOMMENTS');
  console.log(JSON.stringify(comments, undefined, 2));
};

const createPostForUser = async (authorId, data) => {
  const userExists = await prisma.exists.User({ id: authorId });

  if (!userExists) throw new Error('User is not recognised');

  const newPost = await prisma.mutation.createPost(
    {
      data: {
        ...data,
        author: { connect: { id: authorId } },
      },
    },
    '{ author { id name email posts { id title body published } } }'
  );

  return newPost.author;
};

const updatePostForUser = async (postId, data) => {
  const postExists = await prisma.exists.Post({ id: postId });

  if (!postExists) throw new Error('Post is not recognised');

  const updated = await prisma.mutation.updatePost(
    {
      where: { id: postId },
      data,
    },
    '{ author { id name email posts { id title body published } } }'
  );

  return updated.author;
};

// createPostForUser('ckbjtbx47003j0737jy1ec0a2', {
//   title: 'Two of these async posts?',
//   body: 'Post was created by createPostForUser to see if we get two',
//   published: true,
// })
//   .then((data) => {
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((e) => console.error(e.message));

// updatePostForUser('ckbkwf35500fn0737rvzmb7wg', {
//   title: 'Updated async post with error handling',
//   body: 'Updated again via updatePostForUser',
//   published: true,
// })
//   .then((data) => {
//     console.log('USER');
//     console.log(JSON.stringify(data, undefined, 2));
//   })
//   .catch((e) => console.error(e.message));
