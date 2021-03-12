import { gql } from '@apollo/client';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        customer {
            id
            wishlists {
                id
                items_count
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
                                option_label
                                value_label
                            }
                        }
                    }
                }
                name
                visibility
                sharing_code
            }
        }
    }
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
};
