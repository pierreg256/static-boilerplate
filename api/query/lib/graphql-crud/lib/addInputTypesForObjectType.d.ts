import { GraphQLInputObjectType, GraphQLObjectType, GraphQLSchema } from "graphql";
export interface AddInputTypesForObjectTypeProps {
    objectType: GraphQLObjectType;
    schema: GraphQLSchema;
    prefix?: string;
    modifyField?: (field: any, parent: any) => any;
    parent?: any;
}
export declare const createInputField: (field: any, inputType: any) => {
    name: any;
    type: any;
};
export declare const addInputTypesForObjectType: ({ objectType, schema, prefix, modifyField, parent, }: AddInputTypesForObjectTypeProps) => GraphQLInputObjectType;
