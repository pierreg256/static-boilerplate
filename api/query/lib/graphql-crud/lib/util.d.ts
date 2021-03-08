import { GraphQLInputObjectType, GraphQLObjectType, GraphQLSchema } from 'graphql';
export declare const toInputObjectTypeName: (name: string) => string;
export declare const isValidInputFieldType: (type: any) => boolean;
export declare const getInputType: (typeName: string, schema: GraphQLSchema) => GraphQLInputObjectType;
export declare const isNonNullable: (type: any) => any;
export declare const getObjectTypeFromInputType: (typeName: string, schema: GraphQLSchema) => GraphQLObjectType;
export declare const hasDirective: (directive: any, type: any) => any;
