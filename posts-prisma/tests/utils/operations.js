import { gql } from 'apollo-boost';

export const getUsers = gql`
  query {
    users {
      id
      name
      email
    }
  }
`;

export const getMe = gql`
  query {
    me {
      id
      name
      email
    }
  }
`;

export const getPosts = gql`
  query {
    posts {
      title
      body
      published
    }
  }
`;

export const getMyPosts = gql`
  query {
    myposts {
      id
      title
      body
    }
  }
`;

export const createUser = gql`
  mutation($name: String!, $email: String!, $password: String!) {
    createUser(data: { name: $name, email: $email, password: $password }) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const login = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        id
        name
        email
      }
      token
    }
  }
`;

export const createPost = gql`
  mutation($title: String!, $body: String!, $published: Boolean!) {
    createPost(data: { title: $title, body: $body, published: $published }) {
      id
      title
      body
      published
    }
  }
`;

export const updatePost = gql`
  mutation($id: ID!, $title: String, $body: String, $published: Boolean) {
    updatePost(
      id: $id
      data: { title: $title, body: $body, published: $published }
    ) {
      id
      published
    }
  }
`;

export const deletePost = gql`
  mutation($id: ID!) {
    deletePost(id: $id) {
      id
    }
  }
`;
