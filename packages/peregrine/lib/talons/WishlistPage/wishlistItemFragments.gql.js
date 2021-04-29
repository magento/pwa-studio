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
        }
        ... on ConfigurableWishlistItem {
            configurable_options {
                id
                value_id
                option_label
                value_label
            }
        }
    }
`;
