const {
  ApolloServer,
  gql,
  SchemaDirectiveVisitor,
} = require("apollo-server-azure-functions");
const { schemaDirectives } = require("./lib/directives");
const { resolvers } = require("./lib/resolvers");
const CosmosDataSource = require("./lib/cosmosDataSource");

// set up any dataSources our resolvers need
const dataSources = () => ({
  cosmosAPI: new CosmosDataSource(),
});

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  directive @uniqueID(
    # The name of the new ID field, "uid" by default:
    name: String = "uid"

    # Which fields to include in the new ID:
    from: [String] = ["id"]
  ) on OBJECT

  directive @model on OBJECT

  directive @relation(typeName: String) on FIELD_DEFINITION

  scalar Date

  type User @model {
    id: ID!
    nick_name: String
    birthday: Date
    posts: [Post] @relation
  }

  type Post @model {
    id: ID!
    text: String!
    author_id: ID
    author: User @relation
  }

  type Query {
    hello: String
    users: [User]
    posts: [Post]
    user(id: ID!): User
  }

  type Mutation {
    addUser(id: ID!, birthday: Date): User
    addPost(text: String!, userId: ID!): Post
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  schemaDirectives,
  tracing: true,
});

exports.graphqlHandler = server.createHandler();
