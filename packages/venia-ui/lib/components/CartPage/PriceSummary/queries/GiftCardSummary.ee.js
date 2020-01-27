import gql from 'graphql-tag';

export default gql`
    fragment GiftCardSummaryFragment on Cart {
        applied_gift_cards {
            applied_balance {
                value
                currency
            }
        }
    }
`;
