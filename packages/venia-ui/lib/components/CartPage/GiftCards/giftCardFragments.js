import { gql } from '@apollo/client';

export const GiftCardFragment = gql`
    fragment GiftCardFragment on Cart {
        __typename
        id
    }
`;
