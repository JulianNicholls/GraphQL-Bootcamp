export default {
  author: ({ author }, _args, { db }) => db.users.find(({ id }) => author === id),
  comments: ({ id }, _args, { db }) =>
    db.comments.filter(({ post }) => post === id),
};
