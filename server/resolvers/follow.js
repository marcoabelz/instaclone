const Follow = require("../models/Follow");
const { GraphQLError } = require("graphql");
const { ObjectId } = require("mongodb");

const resolvers = {
  Query: {
    follows: async (_, __, contextValue) => {
      const user = contextValue.authentication();
      const data = await Follow.findAll();
      return data;
    },
  },
  Mutation: {
    followUser: async (_, args, contextValue) => {
      try {
        const user = contextValue.authentication();
        const body = args.newFollow;
        body.followerId = new ObjectId(user.id);
        const data = await Follow.create(body);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
