import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query Users {
    users {
      _id
      name
      username
      email
      password
    }
  }
`;

export const GET_USER_BY_ID = gql`
  query FindUserById($id: ID) {
    findUserById(_id: $id) {
      _id
      name
      username
      email
      password
      follower {
        followerId
        followerDetail {
          username
        }
      }
      following {
        followingId
        followingDetail {
          username
        }
      }
    }
  }
`;

export const GET_USER_BY_USERNAME = gql`
  query SearchUserByUsername($username: String) {
    searchUserByUsername(username: $username) {
      _id
      name
      username
      email
      password
    }
  }
`;