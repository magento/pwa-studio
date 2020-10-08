import { gql } from '@apollo/client';

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
                name
                small_image {
                    url
                }
                url_key
                url_suffix
                price {
                    regularPrice {
                        amount {
                            value
                            currency
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

export default {
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getProductFiltersBySearchQuery: GET_PRODUCT_FILTERS_BY_SEARCH,
    productSearchQuery: PRODUCT_SEARCH
};
