import { gql } from '@apollo/client';

export const ItemsReviewFragment = gql`
    fragment ItemsReviewFragment on Cart {
        id
        total_quantity
        items {
            id
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                uid
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
            ... on ConfigurableCartItem {
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
