import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            product {
                id
                name
                sku
                url_key
                url_suffix
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            small_image {
                                url
                            }
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configured_variant @client {
                    small_image {
                        url
                    }
                }
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
