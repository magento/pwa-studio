import { gql } from '@apollo/client';

export const GET_CATEGORY_AVAILABLE_SORT_METHODS = gql`
    query GetCategoryAvailableSortMethods($categoryIdFilter: FilterEqualTypeInput!) {
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

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query GetProductFiltersByCategory($categoryIdFilter: FilterEqualTypeInput!) {
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

export default {
    getCategoryAvailableSortMethodsQuery: GET_CATEGORY_AVAILABLE_SORT_METHODS,
    getCategoryDataQuery: GET_CATEGORY_DATA,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY
};
