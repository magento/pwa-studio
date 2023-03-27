import { gql } from '@apollo/client';

export const GiftOptionsSummaryFragment = gql`
    fragment GiftOptionsSummaryFragment on Cart {
        id
        __typename
    }
`;
