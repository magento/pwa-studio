import { gql } from '@apollo/client';

export const ProductFormFragment = gql`
    fragment ProductFormFragment on ProductInterface {
        id
        sku
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
                label
                values {
                    default_label
                    label
                    store_label
                    use_default_value
                    value_index
                    swatch_data {
                        ... on ImageSwatchData {
                            thumbnail
                        }
                        value
                    }
                }
            }
            variants {
                attributes {
                    code
                    value_index
                }
                product {
                    id
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                    sku
                }
            }
        }
    }
`;
