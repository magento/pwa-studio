import gql from 'graphql-tag';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        categories {
            id
            breadcrumbs {
                category_id
            }
        }
        description {
            html
        }
        id
        media_gallery_entries {
            id
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
        url_key
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
                    media_gallery_entries {
                        id
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

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailsForProductPage(
        $urlKey: String
        $onServer: Boolean!
    ) {
        productDetail: products(filter: { url_key: { eq: $urlKey } }) {
            items {
                ...ProductDetailsFragment
                # id is always required, even if the fragment includes it
                id
                # I don't know how to pass variables to a fragment...
                meta_title @include(if: $onServer)
                meta_keyword @include(if: $onServer)
                # Even though these are already requested in the fragment,
                # the server may return an incorrect response if you don't hard
                # code the fields.
                # https://github.com/magento/graphql-ce/issues/1027
                # https://github.com/magento/magento2/issues/28584
                description {
                    html
                }
                media_gallery_entries {
                    id
                    label
                    position
                    disabled
                    file
                }
                meta_description
                small_image {
                    url
                }
                url_key
            }
        }
    }
    ${ProductDetailsFragment}
`;
