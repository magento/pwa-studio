import { gql } from '@apollo/client';

export const ProductFormFragment = gql`
    fragment ProductFormFragment on ProductInterface {
        uid
        name
        sku
        url_key
        __typename
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                uid
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
                    uid
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                    price_range {
                        maximum_price {
                            final_price {
                                currency
                                value
                            }
                        }
                    }
                    media_gallery_entries {
                        id
                        disabled
                        file
                        label
                        position
                    }
                    sku
                    stock_status
                }
            }
        }
    }
`;
