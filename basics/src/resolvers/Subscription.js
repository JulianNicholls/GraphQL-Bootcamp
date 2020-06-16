export default {
  count: {
    subscribe: (_parent, _args, { pubsub }) => {
      let count = 0;

      setInterval(() => {
        ++count;
        pubsub.publish('count', { count });
      }, 1000);

      return pubsub.asyncIterator('count');
    },
  },
  comment: {
    subscribe: (_parent, { postId }, { db, pubsub }) => {
      const post = db.posts.find(
        ({ id, published }) => id === postId && published
      );

      if (!post) throw new Error('Post is not recognised');

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
};
