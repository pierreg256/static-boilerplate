const { GraphQLScalarType } = require("graphql");

const ISODateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    const res = Date.parse(value);
    if (isNaN(res)) {
      return null;
    }
    return new Date(value).toISOString(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    const res = Date.parse(ast.value);
    if (isNaN(res)) {
      return null;
    }
    return new Date(ast.value).toISOString();
  },
});

module.exports = { ISODateScalar };
