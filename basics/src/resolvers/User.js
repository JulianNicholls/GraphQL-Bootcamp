export default {
  posts: ({ id }, _args, { db }) => db.posts.filter(({ author }) => author === id),
  comments: ({ id }, _args, { db }) =>
    db.comments.filter(({ author }) => author === id),
};
