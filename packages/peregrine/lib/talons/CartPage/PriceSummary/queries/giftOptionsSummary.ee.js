import { gql } from '@apollo/client';

export const GiftOptionsSummaryFragment = gql`
    fragment GiftOptionsSummaryFragment on Cart {
        id
        prices {
            gift_options {
                printed_card {
                    value
                    currency
                }
            }
        }
    }
`;
