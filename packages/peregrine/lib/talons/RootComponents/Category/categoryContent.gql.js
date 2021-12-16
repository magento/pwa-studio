import { gql } from '@apollo/client';

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductFiltersByCategory(
        $categoryIdFilter: FilterEqualTypeInput!
    ) {
        products(filter: { category_uid: $categoryIdFilter }) {
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
    query getCategoryData($id: String!) {
        categories(filters: { category_uid: { in: [$id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                name
                description
            }
        }
    }
`;

export default {
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY
};
