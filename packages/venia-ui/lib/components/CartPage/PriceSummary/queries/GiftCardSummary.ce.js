import gql from 'graphql-tag';

export const GiftCardSummaryFragment = gql`
    fragment GiftCardSummaryFragment on Cart {
        id
        __typename
    }
`;
