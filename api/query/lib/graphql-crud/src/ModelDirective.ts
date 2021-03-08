import {
  defaultFieldResolver,
  getNamedType,
  getNullableType,
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { isPlainObject, merge } from "lodash";
import * as pluralize from "pluralize";
import {
  addInputTypesForObjectType,
  generateFieldNames,
  getInputType,
  hasDirective,
  Store,
  validateInputData,
} from "./";

export interface ResolverContext {
  directives: {
    model: {
      store: Store;
    };
  };
  [key: string]: any;
}

export interface CreateResolverArgs {
  data: any;
}

export interface FindOneResolverArgs {
  where: any;
}

export interface FindResolverArgs {
  where: any;
}

export interface UpdateResolverArgs {
  data: any;
  where: any;
  upsert: boolean;
}

export interface RemoveResolverArgs {
  where: any;
}

export class ModelDirective extends SchemaDirectiveVisitor {
  public visitObject(type: GraphQLObjectType) {
    // TODO check that id field does not already exist on type
    // Add an "id" field to the object type.
    //
    type.getFields().id = {
      name: "id",
      type: GraphQLID,
      description: "Unique ID",
      args: [],
      resolve: defaultFieldResolver,
      isDeprecated: false,
      deprecationReason: undefined,
      extensions: undefined,
    };

    ["created", "modified", "created_by", "modified_by"].forEach(
      (fieldName) => {
        type.getFields()[fieldName] = {
          name: fieldName,
          type: GraphQLString,
          description: "automatically generated ",
          args: [],
          resolve: defaultFieldResolver,
          isDeprecated: false,
          deprecationReason: undefined,
          extensions: undefined,
        };
      }
    );

    // Modify schema with input types generated based off of the given type
    this.addInputTypes(type);

    // Modify root Mutation type to add create, update, upsert, and remove mutations
    this.addMutations(type);

    // Modify root Query type to add "find one" and "find many" queries
    this.addQueries(type);
  }

  private addInputTypes(objectType: GraphQLObjectType) {
    // Generate corresponding input types for the given type.
    // Each field returning GraphQLObjectType in the given type will also
    // have input types generated recursively.
    addInputTypesForObjectType({
      objectType,
      schema: this.schema,
      modifyField: (field) => {
        field.type = getNullableType(field.type);
        return field;
      },
    });
  }

  private async visitNestedModels({ data, type, modelFunction }) {
    const res = {};

    for (const key of Object.keys(data)) {
      const value = data[key];
      const field = getNamedType(type.getFields()[key]) as any;

      if (!field) continue;

      const fieldType = getNamedType(field.type);

      if (isPlainObject(value) && hasDirective("model", fieldType)) {
        const foundObject = await modelFunction(fieldType, value);
        res[key] = foundObject;
      }

      if (Array.isArray(value) && value.every((v) => isPlainObject(v))) {
        const createdObjects: any[] = [];

        for (const v of value) {
          const foundObject = await modelFunction(fieldType, v);
          createdObjects.push(foundObject);
        }

        res[key] = createdObjects;
      }
    }

    return res;
  }

  private pluckModelObjectIds(data) {
    return Object.keys(data).reduce((res, key) => {
      if (key === "id") {
        return {
          ...res,
          [key]: data[key],
        };
      }
      if (isPlainObject(data[key])) {
        return {
          ...res,
          [key]: this.pluckModelObjectIds(data[key]),
        };
      }
      if (Array.isArray(data[key])) {
        return {
          ...res,
          [key]: data[key].map((value) => this.pluckModelObjectIds(value)),
        };
      }
      return res;
    }, {});
  }

  private findQueryResolver(type) {
    return async (root, args: FindResolverArgs, context: ResolverContext) => {
      const initialData: object[] = await context.directives.model.store.find({
        where: args.where,
        type,
      });

      if (!initialData) {
        return null;
      }

      const results = await Promise.all(
        initialData.map(async (data) => {
          const nestedData = await this.visitNestedModels({
            type,
            data,
            modelFunction: async (type, value) => {
              const found = await this.findOneQueryResolver(type)(
                root,
                { ...args, where: value },
                context
              );
              return found;
            },
          });
          return merge({}, data, nestedData);
        })
      );

      return results;
    };
  }

  private findOneQueryResolver(type) {
    return async (
      root,
      args: FindOneResolverArgs,
      context: ResolverContext
    ) => {
      const rootObject = await context.directives.model.store.findOne({
        where: args.where,
        type,
      });

      if (!rootObject) {
        return null;
      }

      const nestedObjects = await this.visitNestedModels({
        type,
        data: rootObject,
        modelFunction: (type, value) =>
          this.findOneQueryResolver(type)(
            root,
            { ...args, where: value },
            context
          ),
      });

      return merge({}, rootObject, nestedObjects);
    };
  }

  private createMutationResolver(type) {
    return async (root, args: CreateResolverArgs, context: ResolverContext) => {
      validateInputData({
        data: args.data,
        type,
        schema: this.schema,
      });

      const relatedObjects = await this.visitNestedModels({
        type,
        data: args.data,
        modelFunction: async (type, value) => {
          if (value.id) {
            const found = await this.findOneQueryResolver(type)(
              root,
              { where: { id: value.id } },
              context
            );
            return found;
          }
          const createdObject = await this.createMutationResolver(type)(
            root,
            { ...args, data: value },
            context
          );
          return createdObject;
        },
      });

      const objectIds = this.pluckModelObjectIds(relatedObjects);

      const rootObject = await context.directives.model.store.create({
        data: {
          ...args.data,
          ...objectIds,
        },
        type,
      });

      const mergedObjects = {
        ...rootObject,
        ...relatedObjects,
      };

      return mergedObjects;
    };
  }

  private updateResolver(type) {
    return async (root, args: UpdateResolverArgs, context: ResolverContext) => {
      validateInputData({
        data: args.data,
        type,
        schema: this.schema,
      });

      const relatedObjects = await this.visitNestedModels({
        type,
        data: args.data,
        modelFunction: async (type, value) => {
          if (value.id) {
            const updated = await this.updateResolver(type)(
              root,
              {
                data: value,
                where: {
                  id: value.id,
                },
                upsert: false,
              },
              context
            );
            if (updated) {
              const foundObject = await this.findOneQueryResolver(type)(
                root,
                {
                  where: {
                    id: value.id,
                  },
                },
                context
              );

              return foundObject;
            }
          }
          return value;
        },
      });

      const objectIds = this.pluckModelObjectIds(relatedObjects);

      const updated = await context.directives.model.store.update({
        where: args.where,
        data: {
          ...args.data,
          ...objectIds,
        },
        upsert: args.upsert,
        type,
      });

      if (!updated) {
        throw new Error(`Failed to update ${type}`);
      }

      const rootObject = await context.directives.model.store.findOne({
        where: args.where,
        type,
      });

      const mergedObjects = {
        ...rootObject,
        ...relatedObjects,
      };

      return mergedObjects;
    };
  }

  // Helper function for adding mutations to the schema
  private addMutation(field, replaceExisting = false) {
    if (
      replaceExisting ||
      !(this.schema.getMutationType() as any).getFields()[field.name]
    ) {
      (this.schema.getMutationType() as any).getFields()[field.name] = field;
    }
  }

  // Helper function for adding queries to the schema
  private addQuery(field, replaceExisting = false) {
    if (
      replaceExisting ||
      !(this.schema.getQueryType() as any).getFields()[field.name]
    ) {
      (this.schema.getQueryType() as any).getFields()[field.name] = field;
    }
  }

  private addMutations(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // TODO add check to make sure mutation root type is defined and if not create it

    // create mutation

    this.addMutation({
      name: names.mutation.create,
      type,
      description: `Create a ${type.name}`,
      args: [
        {
          name: "data",
          type: this.schema.getType(names.input.type),
        },
      ],
      resolve: this.createMutationResolver(type),
      isDeprecated: false,
    });

    // update mutation

    this.addMutation({
      name: names.mutation.update,
      type,
      description: `Update a ${type.name}`,
      args: [
        {
          name: "data",
          type: getInputType(type.name, this.schema),
        },
        {
          name: "where",
          type: getInputType(type.name, this.schema),
        } as any,
        {
          name: "upsert",
          type: GraphQLBoolean,
        } as any,
      ],
      resolve: this.updateResolver(type),
      isDeprecated: false,
    });

    // remove mutation

    this.addMutation({
      name: names.mutation.remove,
      type: GraphQLBoolean,
      description: `Remove a ${type.name}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
      ],
      resolve: (root, args: RemoveResolverArgs, context: ResolverContext) => {
        return context.directives.model.store.remove({
          where: args.where,
          type,
        });
      },
      isDeprecated: false,
    });
  }

  private addQueries(type: GraphQLObjectType) {
    const names = generateFieldNames(type.name);

    // find one query

    this.addQuery({
      name: names.query.one,
      type,
      description: `Find one ${type.name}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
      ],
      resolve: this.findOneQueryResolver(type),
      isDeprecated: false,
    });

    // find many query

    this.addQuery({
      name: names.query.many,
      type: new GraphQLList(type),
      description: `Find multiple ${pluralize.plural(type.name)}`,
      args: [
        {
          name: "where",
          type: this.schema.getType(names.input.type),
        } as any,
      ],
      resolve: this.findQueryResolver(type),
      isDeprecated: false,
    });
  }
}
