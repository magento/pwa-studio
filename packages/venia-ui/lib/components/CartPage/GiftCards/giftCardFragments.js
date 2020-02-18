import gql from 'graphql-tag';

export const GiftCardFragment = gql`
    fragment GiftCardFragment on Cart {
        __typename
        id
    }
`;
