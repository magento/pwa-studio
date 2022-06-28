import { gql } from '@apollo/client';

export const ItemsReviewFragment = gql`
    fragment ItemsReviewFragment on Cart {
        id
        total_quantity
        prices {
            grand_total {
                value
                currency
            }
        }
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        items {
            uid
            prices {
                price {
                    value
                    currency
                    __typename
                }
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                categories {
                    name
                }
                uid
                sku
                name
                thumbnail {
                    url
                }
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
                        product {
                            uid
                            thumbnail {
                                url
                            }
                        }
                    }
                }
            }
            quantity
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ConfigurableCartItem {
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                configurable_options {
                    configurable_product_option_uid
                    option_label
                    configurable_product_option_value_uid
                    value_label
                }
            }
        }
    }
`;
