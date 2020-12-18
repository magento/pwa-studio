import { gql } from '@apollo/client';

// We disable linting for local fields because there is no way to add them to
// the fetched schema.
// https://github.com/apollographql/eslint-plugin-graphql/issues/99
/* eslint-disable graphql/template-strings */
export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
        id
        items {
            id
            product {
                id
                name
                url_key
                url_suffix
                thumbnail {
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
            ... on ConfigurableCartItem {
                configured_variant @client {
                    thumbnail {
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
/* eslint-enable graphql/template-strings */
