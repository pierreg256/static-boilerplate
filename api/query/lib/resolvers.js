const { UserInputError } = require("apollo-server-azure-functions");
const { GraphQLScalarType, Kind } = require("graphql");
const { ISODateScalar } = require("./commons");

// Provide resolver functions for your schema fields
const resolvers = {
  Date: ISODateScalar,
  Query: {
    hello: () => "Hello world!",
    users: (_, __, { dataSources }, info) => {
      return dataSources.cosmosAPI.getAllItems({ typeName: "User" });
    },
    posts: (_, __, { dataSources }, info) => {
      return dataSources.cosmosAPI.getAllItems({ typeName: "Post" });
    },
    user: async (_, { id }, { dataSources }, info) =>
      dataSources.cosmosAPI.getItemById({
        typeName: info.returnType.name,
        id,
      }),
  },
  Mutation: {
    addUser: async (_, { id, birthday }, { dataSources }, info) => {
      return await dataSources.cosmosAPI.createItem({
        typeName: info.returnType.name,
        item: { id, birthday },
      });
    },
    addPost: async (_, { text, userId }, { dataSources }, info) => {
      const postId = new Date().getTime().toString(36);
      return await dataSources.cosmosAPI.createItem({
        typeName: info.returnType.name,
        item: { id: postId, text, author_user_id: userId },
      });
    },
  },
};

exports.resolvers = resolvers;
