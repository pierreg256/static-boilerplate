const {
  ApolloServer,
  gql,
  SchemaDirectiveVisitor,
  AuthenticationError,
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

  enum Role {
    anonymous
    authenticated
  }

  type User @model {
    id: ID!
    nick_name: String
    birthday: Date
    posts: [Post] @relation
    user_roles: [Role]
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
    addPost(text: String!): Post
  }
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context: async ({ request }) => {
    try {
      const header = request.headers["x-ms-client-principal"];
      const encoded = Buffer.from(header, "base64");
      const decoded = encoded.toString("ascii");
      const clientPrincipal = JSON.parse(decoded);
      return {
        clientPrincipal: JSON.parse(decoded),
      };
    } catch (err) {
      console.log(err);
      throw new AuthenticationError("you must be logged in");
    }
  },
  schemaDirectives,
  tracing: true,
});

exports.graphqlHandler = server.createHandler();