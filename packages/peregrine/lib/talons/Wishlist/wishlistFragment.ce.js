import { gql } from '@apollo/client';

export const WishlistFragment = gql`
    fragment WishlistFragment on Wishlist {
        id
        items: items_v2 {
            items {
                id
                ... on ConfigurableWishlistItem {
                    configurable_options {
                        id
                        value_id
                        option_label
                        value_label
                    }
                }
                product {
                    sku
                }
            }
        }
    }
`;
