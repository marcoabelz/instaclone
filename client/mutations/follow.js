import { gql } from "@apollo/client";

export const FOLLOW = gql`
  mutation FollowUser($newFollow: NewFollow) {
    followUser(newFollow: $newFollow) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;
