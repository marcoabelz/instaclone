require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const { signToken, verifyToken } = require("./helpers/jwt");

const userTypeDefs = require("./schema/user");
const postTypeDefs = require("./schema/post");
const followTypeDefs = require("./schema/follow");

const userResolvers = require("./resolvers/user");
const postResolvers = require("./resolvers/post");
const followResolvers = require("./resolvers/follow");

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolvers, postResolvers, followResolvers],
});

startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },

  context: ({ req }) => {
    function authentication() {
      const authorization = req.headers.authorization || "";
      if (!authorization) {
        throw new GraphQLError(`User is not authenticated`, {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }
      const [type, token] = authorization.split(" ");
      if (type !== "Bearer") {
        throw new GraphQLError(`User is not authenticated`, {
          extensions: {
            code: "UNAUTHENTICATED",
            http: { status: 401 },
          },
        });
      }

      const payload = verifyToken(token);
      return payload;
    }
    return {
      authentication,
    };
  },
})
  .then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  })
  .catch((err) => {
    console.log(err);
  });
