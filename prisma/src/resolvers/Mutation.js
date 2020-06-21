import { v4 as uuid } from 'uuid';

export default {
  createUser: async (_parent, { data }, { prisma }, info) => {
    const dup = await prisma.exists.User({ email: data.email });

    if (dup) throw new Error('Email address is already in use.');

    return prisma.mutation.createUser({ data }, info);
  },
  createPost: (_parent, { data }, { db, pubsub }) => {
    const userFound = db.users.some(({ id }) => id === data.author);

    if (!userFound) throw new Error('Author is not recognised');

    const newPost = { id: uuid(), ...data };

    db.posts.push(newPost);

    if (newPost.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATE',
          data: newPost,
        },
      });
    }

    return newPost;
  },
  createComment: (_parent, { data }, { db, pubsub }) => {
    const userFound = db.users.some(({ id }) => id === data.author);
    const postFound = db.posts.some(
      ({ id, published }) => id === data.post && published
    );

    if (!userFound) throw new Error('Author is not recognised');
    if (!postFound) throw new Error('Post is not a published post');

    const newComment = { id: uuid(), ...data };

    db.comments.push(newComment);

    pubsub.publish(`comment ${data.post}`, {
      comment: {
        mutation: 'CREATE',
        data: newComment,
      },
    });

    return newComment;
  },
  updateUser: (_parent, { id, data }, { db }) => {
    const user = db.users.find((user) => user.id === id);

    if (!user) throw new Error('User is not recognised');

    // Check that the new email address is not in user
    if (data.email) {
      const dup = db.users.some(({ email }) => email === data.email);

      if (dup) throw new Error('Email address is already in use.');

      user.email = data.email;
    }

    if (data.name) user.name = data.name;
    if (data.age !== undefined) user.age = data.age;

    return user;
  },
  updatePost: (_parent, { id, data }, { db, pubsub }) => {
    const post = db.posts.find((post) => post.id === id);
    const original = { ...post };

    if (!post) throw new Error('Post is not recognised');

    if (data.title) post.title = data.title;
    if (data.body) post.body = data.body;

    // Published status has changed, potentially
    if (
      typeof data.published == 'boolean' &&
      data.published !== original.published
    ) {
      post.published = data.published;

      if (data.published && !original.published) {
        // Publish post, signal CREATE
        pubsub.publish('post', {
          post: {
            mutation: 'CREATE',
            data: post,
          },
        });
      } else if (!data.published && original.published) {
        // Unpublish, signal DELETE
        pubsub.publish('post', {
          post: {
            mutation: 'DELETE',
            data: { ...original, published: false }, // Hide updates
          },
        });
      }
    } else if (post.published) {
      // Update post, signal UPDATE
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATE',
          data: post,
        },
      });
    }

    return post;
  },
  updateComment: (_parent, { id, data: { text } }, { db, pubsub }) => {
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) throw new Error('Comment is not recognised');

    // Guaranteed to have new text, so just put it in
    comment.text = text;

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'UPDATE',
        data: comment,
      },
    });

    return comment;
  },
  deleteUser: async (_parent, { id }, { prisma }, info) => {
    const userExists = await prisma.exists.User({ id });

    if (!userExists) throw new Error('User is not recognised');

    return prisma.mutation.deleteUser({ where: { id } }, info);
  },
  deletePost: (_parent, args, { db, pubsub }) => {
    const postIndex = db.posts.findIndex(({ id }) => id === args.id);

    if (postIndex === -1) throw new Error('Post is not recognised');

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== post.id);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETE',
          data: post,
        },
      });
    }

    return post;
  },
  deleteComment: (_parent, args, { db, pubsub }) => {
    const commentIndex = db.comments.findIndex(({ id }) => id === args.id);

    if (commentIndex === -1) throw new Error('Comment is not recognised');

    const [comment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: 'DELETE',
        data: comment,
      },
    });

    return comment;
  },
};
