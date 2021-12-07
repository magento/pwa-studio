import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categories {
            uid
            breadcrumbs {
                category_uid
            }
        }
        description {
            html
        }
        id
        uid
        media_gallery_entries {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            uid
            label
            position
            disabled
            file
        }
        meta_description
        name
        price {
            regularPrice {
                amount {
                    currency
                    value
                }
            }
        }
        sku
        small_image {
            url
        }
        stock_status
        url_key
        ... on ConfigurableProduct {
            configurable_options {
                attribute_code
                attribute_id
                id
                label
                values {
                    uid
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
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    media_gallery_entries {
                        uid
                        disabled
                        file
                        label
                        position
                    }
                    sku
                    stock_status
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                }
            }
        }
    }
`;
