import { gql } from '@apollo/client';

export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
        id
        items {
            id
            uid
            product {
                uid
                name
                url_key
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
