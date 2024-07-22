const User = require("../models/User");
const { hashPassword, comparePassword } = require("../helpers/bcrypt");
const { GraphQLError } = require("graphql");
const validator = require("validator");
const { signToken } = require("../helpers/jwt");

const resolvers = {
  Query: {
    users: async (_, __, contextValue) => {
      contextValue.authentication();
      const data = await User.findAll();
      return data;
    },
    findUserById: async (_, args, contextValue) => {
      contextValue.authentication();
      const data = await User.findById(args._id);
      // console.log(JSON.stringify(data[0], null, 2));
      return data[0];
    },
    searchUserByUsername: async (_, args, contextValue) => {
      contextValue.authentication();
      const data = await User.searchUserByUsername(args.username);
      // console.log(data);
      return data;
    },
  },
  Mutation: {
    register: async (_, args) => {
      try {
        const body = args.newUser;

        //email validator
        if (!validator.isEmail(body.email)) {
          throw new GraphQLError(`Please enter valid email`, {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 401 },
            },
          });
        }

        //unique checker
        const emailUniqueChecker = await User.findByEmail(body);
        if (emailUniqueChecker) {
          throw new GraphQLError(`Email already taken`, {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 401 },
            },
          });
        }

        //username checker
        const usernameUniqueChecker = await User.findByUsername(body);
        if (usernameUniqueChecker) {
          throw new GraphQLError(`Username already taken`, {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 401 },
            },
          });
        }

        //password length checker
        if (body.password.length < 5) {
          throw new GraphQLError(`Password length min 5`, {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 401 },
            },
          });
        }
        // body.password = hashPassword(body.password);
        const data = await User.create(body);

        const result = await User.findOne(data.insertedId);
        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    login: async (_, args) => {
      try {
        const body = args.userLogin;
        const data = await User.findByUsername(body);
        if (!data) {
          throw new GraphQLError(`User not found`, {
            extensions: {
              code: "BAD_USER_INPUT",
              http: { status: 404 },
            },
          });
        }
        if (!comparePassword(body.password, data.password)) throw new Error("Invalid username / password");

        // console.log(data);

        // const result = await User.findById(data._id);
        const result = {
          access_token: signToken({
            id: data._id,
            email: data.email,
            username: data.username,
          }),
          id: data._id,
          username: data.username,
        };
        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};

module.exports = resolvers;
