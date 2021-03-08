import { GraphQLField } from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';
export declare class RelationDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field: GraphQLField<any, any>): void;
}
