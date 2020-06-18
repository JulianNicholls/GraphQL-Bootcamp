export default {
  comment: {
    subscribe: (_parent, { postId }, { db, pubsub }) => {
      const post = db.posts.find(
        ({ id, published }) => id === postId && published
      );

      if (!post) throw new Error('Post is not recognised');

      return pubsub.asyncIterator(`comment ${postId}`);
    },
  },
  post: {
    subscribe: (_parent, _args, { pubsub }) => {
      return pubsub.asyncIterator('post');
    },
  },
};
