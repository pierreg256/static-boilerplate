import { GraphQLObjectType, GraphQLSchema } from 'graphql';
export interface ValidateInputDataProps {
    type: GraphQLObjectType;
    schema: GraphQLSchema;
    data: object;
}
export declare const validateInputData: (props: ValidateInputDataProps) => void;
