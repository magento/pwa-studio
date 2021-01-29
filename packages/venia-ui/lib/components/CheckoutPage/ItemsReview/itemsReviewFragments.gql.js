import { gql } from '@apollo/client';

export const ItemsReviewFragment = gql`
    fragment ItemsReviewFragment on Cart {
        id
        total_quantity
        items {
            id
            product {
                id
                name
                thumbnail {
                    url
                }
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
