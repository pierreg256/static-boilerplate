import { GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
export declare class DefaultDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>): void;
}
