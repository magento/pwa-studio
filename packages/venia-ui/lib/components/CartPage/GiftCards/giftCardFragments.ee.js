import gql from 'graphql-tag';

export const GiftCardFragment = gql`
    fragment GiftCardFragment on Cart {
        applied_gift_cards {
            code
        }
        id
    }
`;
