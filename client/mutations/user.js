import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($userLogin: UserLogin) {
    login(userLogin: $userLogin) {
      access_token
      id
      username
    }
  }
`;

export const REGISTER = gql`
  mutation Register($newUser: NewUser) {
    register(newUser: $newUser) {
      _id
      email
      name
      password
      username
    }
  }
`;
