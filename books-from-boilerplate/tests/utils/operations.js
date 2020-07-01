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
