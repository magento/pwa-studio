import { gql } from '@apollo/client';

export const ProductFormFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment ProductFormFragment on ProductInterface {
        uid
        sku
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
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
