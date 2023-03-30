import { gql } from '@apollo/client';

export const ProductListingFragment = gql`
    fragment ProductListingFragment on Cart {
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
                small_image {
                    url
                }
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                            label
                            code
                            value_index
                        }
                        product {
                            uid
                            name
                            sku
                            stock_status
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
                row_total {
                    value
                }
                total_item_discount {
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
                    configurable_product_option_uid
                    option_label
                    configurable_product_option_value_uid
                    value_label
                    value_id
                }
            }
        }
    }
`;
