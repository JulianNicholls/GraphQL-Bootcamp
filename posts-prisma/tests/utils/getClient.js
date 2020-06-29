import ApolloBoost from 'apollo-boost';

const getClient = (token = null) =>
  new ApolloBoost({
    uri: 'http://localhost:4000',
    request: (operation) => {
      if (token) {
        operation.setContext({
          headers: {
            Authorization: `bearer ${token}`,
          },
        });
      }
    },
  });

export default getClient;
