import { gql } from '@apollo/client';

/**
 * Local query. GQL support is not available as of today.
 *
 * Once available, we can change the query to match the schema.
 */
const GET_GIFT_OPTIONS = gql`
    query getGiftOptions($cartId: String!) {
        cart(cart_id: $cartId) @client {
            id
            include_gift_receipt
            include_printed_card
            local_gift_message
        }
    }
`;

export default {
    queries: {
        getGiftOptionsQuery: GET_GIFT_OPTIONS
    }
};
