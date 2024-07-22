const typeDefs = `#graphql
    type Follow {
        _id: ID
        followingId: ID
        followerId: ID
        createdAt: String
        updatedAt: String
    }

    type Query {
        follows: [Follow]
    }


    input NewFollow {
        followingId: ID
    }

    type Mutation {
        followUser(newFollow: NewFollow): Follow
    }
`;

module.exports = typeDefs;
