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
  createComment: (_parent, { data }, { db, pubsub }) => {
    const userFound = db.users.some(({ id }) => id === data.author);
    const postFound = db.posts.some(
      ({ id, published }) => id === data.post && published
    );

    if (!userFound) throw new Error('Author is not recognised');
    if (!postFound) throw new Error('Post is not a published post');

    const newComment = { id: uuid(), ...data };

    db.comments.push(newComment);

    pubsub.publish(`comment ${data.post}`, { comment: newComment });

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
  updatePost: (_parent, { id, data }, { db }) => {
    const post = db.posts.find((post) => post.id === id);

    if (!post) throw new Error('Post is not recognised');

    if (data.title) post.title = data.title;
    if (data.body) post.body = data.body;
    if (typeof data.published == 'boolean') post.published = data.published;

    return post;
  },
  updateComment: (_parent, { id, data: { text } }, { db }) => {
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) throw new Error('Comment is not recognised');

    // Guaranteed to have new text, so just put it in
    comment.text = text;

    return comment;
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
  deletePost: (_parent, args, { db }) => {
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
