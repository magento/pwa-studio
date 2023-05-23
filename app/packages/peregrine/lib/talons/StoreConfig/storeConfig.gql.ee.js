import { gql } from '@apollo/client';

export const GET_STORE_CONFIG = gql`
    query GetStoreConfig {
        storeConfig {
            store_code
            product_url_suffix
            magento_wishlist_general_is_enabled
            configurable_thumbnail_source
            category_url_suffix
            locale
            grid_per_page
            store_name
            bank_transfer {
                instructions
            }
            allow_order
            contact_enabled
            copyright
            is_required_login
            newsletter_enabled
            root_category_uid
            store_group_name
            allow_gift_receipt
            allow_printed_card
            enable_multiple_wishlists
            maximum_number_of_wishlists
            # id
            # code
        }
    }
`;

export default {
    getStoreConfigQuery: GET_STORE_CONFIG
};
