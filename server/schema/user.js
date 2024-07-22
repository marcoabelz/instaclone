const typeDefs = `#graphql
    type FollowDetail {
        username: String
    }

    
    type Following {
        followingId: String
        followingDetail: FollowDetail
    }

    type Follower {
        followerId: String
        followerDetail: FollowDetail
    }

    type User {
        _id: ID
        name: String
        username: String
        email: String
        password: String 
    }

    type UserDetail {
        _id: ID
        name: String
        username: String
        email: String
        password: String 
        following: [Following]
        follower: [Follower]
    }

    type LoginResponse {
        access_token: String,
        id: String,
        username: String
    }

    type Query {
        users: [User]
        findUserById(_id:ID): UserDetail
        searchUserByUsername(username:String): [User]
    }

    input NewUser {
        name: String!
        username: String!
        email: String!
        password: String!
    }

    input UserLogin {
        username: String!
        password: String!
    }

    type Mutation {
        register(newUser: NewUser): User
        login(userLogin: UserLogin): LoginResponse
    }
`;

module.exports = typeDefs;

//Schema -> Model(Find, create) -> Resolver
