import { gql } from '@apollo/client';

import { WishlistFragment } from './wishlistFragment.gql';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                items_v2 {
                    items {
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
                }
                ...WishlistFragment
            }
        }
    }
    ${WishlistFragment}
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
};
