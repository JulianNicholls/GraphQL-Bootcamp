// Root Query

export default {
  users: (_parent, args, { db }) => {
    if (!args.query) return db.users;

    const query = args.query.toLocaleLowerCase();

    return db.users.filter(({ name }) => name.toLocaleLowerCase().includes(query));
  },
  posts: (_parent, args, { db }) => {
    if (!args.query) return db.posts;

    const query = args.query.toLocaleLowerCase();

    return db.posts.filter(
      ({ title, body }) =>
        title.toLocaleLowerCase().includes(query) ||
        body.toLocaleLowerCase().includes(query)
    );
  },
  comments: (_parent, _args, { db }) => db.comments,
};
