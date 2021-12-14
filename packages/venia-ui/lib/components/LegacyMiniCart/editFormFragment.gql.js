import { gql } from '@apollo/client';

export const EditFormFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment EditFormFragment on ProductInterface {
        uid
        name
        sku
        url_key
        __typename
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        ... on ConfigurableProduct {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
