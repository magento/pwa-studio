import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    # Once graphql-ce/1027 is resolved other queries can use this fragment.
    # Until then, changes to this fragment must be mirrored in
    # getProductDetail.graphql.
    fragment ProductDetails on ProductInterface {
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

/**
 * An individual "product" query. MagentoGQL does not have an indvidual product
 * query but we can define one and use it as if it did exist. If/When MagentoGQL
 * provides a product query in the schema we can remove @client, remove the
 * server-specific query/handling, and remove the custom typePolicy to allow
 * ApolloClient to query the server.
 */
export const GET_PRODUCT_DETAIL_FROM_CACHE = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        product(url_key: $urlKey) @client {
            # Once graphql-ce/1027 is resolved, use a ProductDetails fragment
            # here instead. Until then, changes to this query (within "items")
            # must be mirrored in ProductDetailsFragment.
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
    }
`;

export const GET_PRODUCT_DETAIL = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                # Once graphql-ce/1027 is resolved, use a ProductDetails fragment
                # here instead. Until then, changes to this query (within "items")
                # must be mirrored in ProductDetailsFragment.
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
        }
    }
`;

export const PRODUCT_TYPE_POLICIES = {
    Query: {
        fields: {
            product: {
                read(cachedProduct, { cache, variables }) {
                    return cache.readFragment({
                        id: `ProductInterface:${variables.urlKey}`,
                        fragment: ProductDetailsFragment
                    });
                }
            }
        }
    }
};
