const { SchemaDirectiveVisitor } = require("apollo-server-azure-functions");
const {
  GraphQLID,
  GraphQLString,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
const { createHash } = require("crypto");
const { ISODateScalar } = require("./commons");

class ModelDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    const fields = type.getFields();
    if (!("id" in fields)) {
      throw new Error("A @model requires an id field");
    }
    ["created", "modified"].forEach((fieldName) => {
      fields[fieldName] = {
        name: fieldName,
        type: ISODateScalar,
        args: [],
      };
    });
    ["created_by", "modified_by"].forEach((fieldName) => {
      fields[fieldName] = {
        name: fieldName,
        type: GraphQLString,
        args: [],
      };
    });
  }
}
class UniqueIdDirective extends SchemaDirectiveVisitor {
  visitObject(type) {
    const { name, from } = this.args;
    const fields = type.getFields();
    if (name in fields) {
      throw new Error(`Conflicting field name ${name}`);
    }
    fields[name] = {
      name,
      type: GraphQLID,
      description: "Unique ID",
      args: [],
      resolve(object) {
        const hash = createHash("sha1");
        hash.update(type.name);
        from.forEach((fieldName) => {
          hash.update(String(object[fieldName]));
        });
        return object[name] || hash.digest("hex");
      },
    };
  }
}

class RelationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field, details) {
    let typeName = "";
    let isList = false;
    if (field.type instanceof GraphQLList) {
      typeName = field.type.ofType.name;
      isList = true;
    } else {
      typeName = field.type.name;
      isList = false;
    }
    const relation_field = `${field.name}_${typeName}_id${
      isList ? "s" : ""
    }`.toLowerCase();
    console.log(relation_field);
    field.resolve = async function (parent, _, { dataSources }, info) {
      const options = {
        typeName,
        id: parent[relation_field],
      };
      console.log(options);
      const result = await dataSources.cosmosAPI.getItemById(options);
      console.log(result);
      return result;
    };
    // const { url } = this.args;
    // field.resolve = () => fetch(url);
  }
}

module.exports.schemaDirectives = {
  uniqueID: UniqueIdDirective,
  model: ModelDirective,
  relation: RelationDirective,
};
