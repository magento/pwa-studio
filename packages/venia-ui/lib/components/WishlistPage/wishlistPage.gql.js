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
            wishlists @client {
                id
                items_count
                items_v2 {
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
                        child_sku
                        configurable_options {
                            id
                            option_label
                            value_label
                        }
                    }
                }
                name
                sharing_code
            }
        }
    }
`;

const MOCK_WISHLISTS = [
    {
        id: 123,
        items_count: 1,
        items_v2: [
            {
                __typename: 'ConfigurableWishlistItem',
                id: 1,
                child_sku: 'VD04-PE-XS',
                configurable_options: [
                    { id: 1, option_label: 'Color', value_label: 'Peach' },
                    { id: 2, option_label: 'Size', value_label: 'XS' }
                ],
                product: {
                    id: 1149,
                    image: {
                        label: 'Felicia Maxi Dress',
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/d/vd04-pe_main_2.jpg'
                    },
                    name: 'Felicia Maxi Dress',
                    price_range: {
                        maximum_price: {
                            final_price: {
                                currency: 'USD',
                                value: 128
                            }
                        }
                    },
                    sku: 'VD04'
                }
            },
            {
                __typename: 'SimpleWishlistItem',
                id: 2,
                product: {
                    id: 1150,
                    image: {
                        label: 'Silver Sol Earrings',
                        url:
                            'https://master-7rqtwti-mfwmkrjfqvbjk.us-4.magentosite.cloud/media/catalog/product/cache/d3ba9f7bcd3b0724e976dc5144b29c7d/v/a/va15-si_main.jpg'
                    },
                    name: 'Silver Sol Earrings',
                    price_range: {
                        maximum_price: {
                            final_price: {
                                currency: 'USD',
                                value: 48
                            }
                        }
                    },
                    sku: 'VA15-SI-NA'
                }
            }
        ],
        name: 'Favorites',
        sharing_code: null
    }
];

export const CUSTOM_TYPES = {
    Customer: {
        fields: {
            wishlists: {
                read(cached) {
                    return cached || MOCK_WISHLISTS;
                }
            }
        }
    }
};

export default {
    queries: {
        getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST
    },
    types: CUSTOM_TYPES
};
