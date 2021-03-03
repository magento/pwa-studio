import { gql } from '@apollo/client';

/*
    This feature is being built ahead of GraphQL coverage that is landing in 2.4.2 of Magento. We're going to mock
    the data based on the approved schema to make removing the mocking layer as seamless as possible.

    @see https://github.com/magento/architecture/blob/master/design-documents/graph-ql/coverage/Wishlist.graphqls
 */
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
    queries: {
        getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
    }
};
