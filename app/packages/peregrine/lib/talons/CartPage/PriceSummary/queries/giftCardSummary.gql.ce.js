import { gql } from '@apollo/client';

export const GiftCardSummaryFragment = gql`
    fragment GiftCardSummaryFragment on Cart {
        id
        __typename
    }
`;
