const typeDefs = `#graphql

    type CommentDetail {
        content: String!
        username: String!
        createdAt: String
        updatedAt: String
    }

    type LikeDetail {
        username: String!
        createdAt: String
        updatedAt: String
    }

    type Author {
        _id: ID
        name: String
        username: String
        email: String
    }

    type Post {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        authorId: ID!
        comments: [CommentDetail]
        likes: [LikeDetail]
        createdAt: String
        updatedAt: String
        author: Author
    }

        type UserProfile {
        _id: ID
        content: String!
        tags: [String]
        imgUrl: String
        authorId: ID!
        comments: [CommentDetail]
        likes: [LikeDetail]
        createdAt: String
        updatedAt: String
    }

    type Query {
        posts: [Post]
        findPostById(_id:ID) : Post
        postPerUser(userId: ID): [UserProfile]
    }

    input NewPost {
        content: String!
        tags: [String]
        imgUrl: String
    }

    input NewComment {
        postId: String!
        content: String!
    }

    input NewLike {
        postId: String
    }

    type Mutation {
        createPost(newPost: NewPost): Post
        createComment(newComment: NewComment): Post
        createLike(newLike: NewLike): Post
    }
`;

module.exports = typeDefs;
