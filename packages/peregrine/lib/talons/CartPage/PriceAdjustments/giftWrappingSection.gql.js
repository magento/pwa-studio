import { gql } from '@apollo/client';

const GET_WRAPPING_CONFIG = gql`
    query GetStoreConfigForWrapping {
        storeConfig {
            id
            allow_gift_wrapping_on_order
            allow_gift_wrapping_on_order_items
            allow_gift_receipt
            allow_printed_card
            printed_card_price
            cart_gift_wrapping
            cart_printed_card
            sales_gift_wrapping
            sales_printed_card
        }
    }
`;

export default {
    getWrappingConfigQuery: GET_WRAPPING_CONFIG
};
