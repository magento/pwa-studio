import { gql } from '@apollo/client';

export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
        id
        items {
            uid
            product {
                uid
                name
                sku
                url_key
                thumbnail {
                    url
                }
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                            label
                        }
                        product {
                            uid
                            name
                            sku
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
                total_item_discount {
                    value
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
