import { gql } from '@apollo/client';

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductFiltersByCategory(
        $categoryIdFilter: FilterEqualTypeInput!
    ) {
        products(filter: { category_id: $categoryIdFilter }) {
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

export const GET_CATEGORY_CONTENT = gql`
    query getCategoryData($id: Int!) {
        category(id: $id) {
            id
            name
            description
        }
    }
`;

export const GET_CATEGORY_AVAILABLE_SORT_METHODS = gql`
    query getCategoryAvailableSortMethods(
        $categoryIdFilter: FilterEqualTypeInput!
    ) {
        products(filter: { category_id: $categoryIdFilter }) {
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
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY,
    getCategoryAvailableSortMethodsQuery: GET_CATEGORY_AVAILABLE_SORT_METHODS
};
