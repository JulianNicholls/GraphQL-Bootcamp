import { v4 as uuid } from 'uuid';

export default {
  createUser: (_parent, { data }, { db }) => {
    const dup = db.users.some(({ email }) => email === data.email);

    if (dup) throw new Error('Email address is already in use.');

    const newUser = { id: uuid(), ...data };

    db.users.push(newUser);

    return newUser;
  },
  createPost: (_parent, { data }, { db }) => {
    const userFound = db.users.some(({ id }) => id === data.author);

    if (!userFound) throw new Error('Author is not recognised');

    const newPost = { id: uuid(), ...data };

    db.posts.push(newPost);

    return newPost;
  },
  createComment: (_parent, { data }, { db }) => {
    const userFound = db.users.some(({ id }) => id === data.author);
    const postFound = db.posts.some(
      ({ id, published }) => id === data.post && published
    );

    if (!userFound) throw new Error('Author is not recognised');
    if (!postFound) throw new Error('Post is not a published post');

    const newComment = { id: uuid(), ...data };

    db.comments.push(newComment);

    return newComment;
  },
  deleteUser: (_parent, args, { db }) => {
    const userIndex = db.users.findIndex(({ id }) => id === args.id);

    if (userIndex === -1) throw new Error('User is not recognised');

    const [user] = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      if (post.author !== user.id) return true;

      db.comments = db.comments.filter((comment) => comment.post !== post.id);

      return false;
    });

    db.comments = db.comments.filter(({ author }) => author !== user.id);

    return user;
  },
  deletePost: (_post, args, { db }) => {
    const postIndex = db.posts.findIndex(({ id }) => id === args.id);

    if (postIndex === -1) throw new Error('Post is not recognised');

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== post.id);

    return post;
  },
  deleteComment: (_parent, args, { db }) => {
    const commentIndex = db.comments.findIndex(({ id }) => id === args.id);

    if (commentIndex === -1) throw new Error('Comment is not recognised');

    const [comment] = db.comments.splice(commentIndex, 1);

    return comment;
  },
};
