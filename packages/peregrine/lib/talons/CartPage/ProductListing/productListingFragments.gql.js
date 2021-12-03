import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
        id
        items {
            id
            uid
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                uid
                name
                sku
                url_key
                thumbnail {
                    url
                }
                small_image {
                    url
                }
                stock_status
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
                        product {
                            uid
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
            errors {
                code
                message
            }
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    configurable_product_option_value_uid
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
