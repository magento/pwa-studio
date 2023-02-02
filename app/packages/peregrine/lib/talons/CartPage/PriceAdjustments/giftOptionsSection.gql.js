import { gql } from '@apollo/client';

const GET_GIFT_OPTIONS_CONFIG = gql`
    query GetStoreConfigForGiftOptions {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            allow_order
            allow_gift_receipt
            allow_printed_card
        }
    }
`;

export default {
    getGiftOptionsConfigQuery: GET_GIFT_OPTIONS_CONFIG
};
