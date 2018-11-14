import { GraphQL } from 'types';

export type PriceModel = GraphQL<{
    regularPrice: GraphQL<{
        amount: GraphQL<{
            currency: string;
            value: number;
        }>
    }>
}>;