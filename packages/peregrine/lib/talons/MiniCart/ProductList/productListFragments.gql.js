import { gql } from '@apollo/client';

export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        items {
            uid
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                uid
                name
                url_key
                thumbnail {
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
                            thumbnail {
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
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ConfigurableCartItem {
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
