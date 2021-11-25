import { gql } from '@apollo/client';

export const EditFormFragment = gql`
    fragment EditFormFragment on ProductInterface {
        uid
        name
        sku
        url_key
        __typename
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
                    uid
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
