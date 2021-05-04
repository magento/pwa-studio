import { gql } from '@apollo/client';

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        product {
            id
            image {
                label
                url
            }
            name
            price_range {
                maximum_price {
                    final_price {
                        currency
                        value
                    }
                }
            }
            sku
            stock_status
            ... on ConfigurableProduct {
                configurable_options {
                    id
                    attribute_id_v2
                    values {
                        uid
                        value_index
                    }
                }
            }
        }
        ... on ConfigurableWishlistItem {
            configurable_options {
                id
                option_label
                value_id
                value_label
            }
        }
    }
`;
