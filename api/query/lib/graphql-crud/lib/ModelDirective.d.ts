import { GraphQLObjectType } from "graphql";
import { SchemaDirectiveVisitor } from "graphql-tools";
import { Store } from "./";
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
export declare class ModelDirective extends SchemaDirectiveVisitor {
    visitObject(type: GraphQLObjectType): void;
    private addInputTypes;
    private visitNestedModels;
    private pluckModelObjectIds;
    private findQueryResolver;
    private findOneQueryResolver;
    private createMutationResolver;
    private updateResolver;
    private addMutation;
    private addQuery;
    private addMutations;
    private addQueries;
}
