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
    user: async (_, { id }, { dataSources, clientPrincipal }, info) => {
      console.log(clientPrincipal);
      await dataSources.cosmosAPI.createOrUpdateUser(clientPrincipal);
      return dataSources.cosmosAPI.getItemById({
        typeName: info.returnType.name,
        id,
      });
    },
  },
  Mutation: {
    addUser: async (
      _,
      { id, birthday },
      { dataSources, clientPrincipal },
      info
    ) => {
      const user = await dataSources.cosmosAPI.createOrUpdateUser(
        clientPrincipal
      );
      return await dataSources.cosmosAPI.createItem({
        typeName: info.returnType.name,
        item: { id, birthday },
        user,
      });
    },
    addPost: async (_, { text }, { dataSources, clientPrincipal }, info) => {
      const postId = new Date().getTime().toString(36);
      const user = await dataSources.cosmosAPI.createOrUpdateUser(
        clientPrincipal
      );
      return await dataSources.cosmosAPI.createItem({
        typeName: info.returnType.name,
        item: { id: postId, text, author_user_id: user.id },
        user,
      });
    },
  },
};

exports.resolvers = resolvers;
