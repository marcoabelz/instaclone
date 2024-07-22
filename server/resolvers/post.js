const redis = require("../config/redis");
const Post = require("../models/Post");
const { ObjectId } = require("mongodb");

const resolvers = {
  Query: {
    posts: async (_, __, contextValue) => {
      const user = contextValue.authentication();
      const cache = await redis.get("posts");
      if (cache) {
        console.log("Redis");
        return JSON.parse(cache);
      }
      const data = await Post.findAll();
      console.log("mongodb");
      await redis.set("posts", JSON.stringify(data));
      console.log(data);
      return data;
    },
    findPostById: async (_, args, contextValue) => {
      contextValue.authentication();
      const data = await Post.findById(args._id);
      console.log(data);
      return data[0];
    },
    postPerUser: async (_, args, contextValue) => {
      contextValue.authentication();
      const data = await Post.postsPerUser(args.userId);
      return data;
    },
  },
  Mutation: {
    createPost: async (_, args, contextValue) => {
      try {
        const user = contextValue.authentication();
        const body = args.newPost;
        body.authorId = new ObjectId(user.id);
        const newPost = await Post.create(body);
        await redis.del("posts");
        const result = await Post.findById(newPost.insertedId);
        return result[0];
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    createComment: async (_, args, contextValue) => {
      try {
        const user = contextValue.authentication();
        const body = args.newComment;
        const newComment = await Post.insertComment(body, user);
        await redis.del("posts");
        return newComment;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    createLike: async (_, args, contextValue) => {
      try {
        const user = contextValue.authentication();
        const body = args.newLike;
        const newLike = await Post.insertLike(body, user);
        await redis.del("posts");
        return newLike;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
