import { gql } from '@apollo/client';

export const GET_PAGE_SIZE = gql`
    query getPageSize {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            grid_per_page
        }
    }
`;

export const GET_PRODUCT_FILTERS_BY_SEARCH = gql`
    query getProductFiltersBySearch($search: String!) {
        products(search: $search) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    value
                }
                position
            }
        }
    }
`;

export const PRODUCT_SEARCH = gql`
    query ProductSearch(
        $currentPage: Int = 1
        $inputText: String!
        $pageSize: Int = 6
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        products(
            currentPage: $currentPage
            pageSize: $pageSize
            search: $inputText
            filter: $filters
            sort: $sort
        ) {
            items {
                id
                uid
                name
                small_image {
                    url
                }
                url_key
                url_suffix
                orParentUrlKey
                price {
                    regularPrice {
                        amount {
                            value
                            currency
                        }
                    }
                    minimalPrice {
                        amount {
                            currency
                            value
                        }
                    }
                }
                price_range {
                    maximum_price {
                        regular_price {
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
                __typename
                url_key
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
                            uid
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
                            stock_status
                            uid
                            name
                            sku
                            description {
                                html
                            }
                            categories {
                                name
                            }
                            price {
                                regularPrice {
                                    amount {
                                        currency
                                        value
                                    }
                                }
                                minimalPrice {
                                    amount {
                                        currency
                                        value
                                    }
                                }
                            }
                        }
                    }
                }

                custom_attributes {
                    attribute_metadata {
                        label
                    }
                    selected_attribute_options {
                        attribute_option {
                            label
                        }
                    }
                }
            }

            page_info {
                total_pages
            }
            total_count
        }
    }
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForSearch {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export const GET_SEARCH_AVAILABLE_SORT_METHODS = gql`
    query getSearchAvailableSortMethods($search: String!) {
        products(search: $search) {
            sort_fields {
                options {
                    label
                    value
                }
            }
        }
    }
`;

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getPageSize: GET_PAGE_SIZE,
    getProductFiltersBySearchQuery: GET_PRODUCT_FILTERS_BY_SEARCH,
    getSearchAvailableSortMethods: GET_SEARCH_AVAILABLE_SORT_METHODS,
    productSearchQuery: PRODUCT_SEARCH
};