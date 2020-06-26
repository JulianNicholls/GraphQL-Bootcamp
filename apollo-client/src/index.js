import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'http://localhostwsl:4000',
});

const usersQuery = gql`
  query Users {
    users {
      name
      email
    }
  }
`;

const postsQuery = gql`
  query Posts {
    posts {
      title
      author {
        name
      }
    }
  }
`;

client
  .query({
    query: usersQuery,
  })
  .then((response) => {
    console.log({ users: response.data });

    let html = '';

    response.data.users.forEach((user) => {
      html += `
        <div>
          <h3>${user.name}</h3>
        </div>
      `;
    });

    document.getElementById('users').innerHTML = html;
  });

client
  .query({
    query: postsQuery,
  })
  .then((response) => {
    console.log({ posts: response.data });

    let html = '';

    response.data.posts.forEach((post) => {
      html += `
        <div>
          <h3>${post.title}</h3>
          <p>by ${post.author.name}</p>
        </div>
      `;
    });

    document.getElementById('posts').innerHTML = html;
  });
