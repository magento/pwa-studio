import { gql } from '@apollo/client';

export const GET_AVAILABLE_SORT_METHODS_BY_CATEGORY = gql`
    query GetAvailableSortMethodsByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
            sort_fields {
                options {
                    label
                    value
                }
            }
        }
    }
`;

export const GET_CATEGORY_DATA = gql`
    query GetCategoryData($id: String!) {
        categories(filters: { category_uid: { in: [$id] } }) {
            items {
                children_count
                description
                include_in_menu
                name
                uid
                url_key
                url_path
                children {
                    children_count
                    image
                    include_in_menu
                    name
                    path
                    position
                    uid
                    url_key
                    url_path
                    url_suffix
                    productImagePreview: products(pageSize: 1) {
                        items {
                            uid
                            small_image {
                                url
                            }
                        }
                    }
                }
            }
        }
    }
`;

export const GET_PRODUCT_AGGREGATIONS_FILTERED_BY_CATEGORY = gql`
    query GetProductAggregationsFilteredByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
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

export const GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY = gql`
    query GetProductItemsFilteredByCategory($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
            items {
                id
                uid
                __typename
                name
                url_key
                url_suffix
            }
        }
    }
`;

export default {
    getAvailableSortMethodsByCategoryQuery: GET_AVAILABLE_SORT_METHODS_BY_CATEGORY,
    getCategoryDataQuery: GET_CATEGORY_DATA,
    getProductAggregationsFilteredByCategoryQuery: GET_PRODUCT_AGGREGATIONS_FILTERED_BY_CATEGORY,
    getProductItemsFilteredByCategoryQuery: GET_PRODUCT_ITEMS_FILTERED_BY_CATEGORY
};
