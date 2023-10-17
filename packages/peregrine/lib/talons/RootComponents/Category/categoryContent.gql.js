import { gql } from '@apollo/client';

export const GET_PRODUCT_FILTERS_BY_CATEGORY = gql`
    query getProductFiltersByCategory(
        $categoryIdFilter: FilterEqualTypeInput!
        $fashionColorFilter: FilterEqualTypeInput!
        $fashionMaterialFilter: FilterEqualTypeInput!
        $fashionSizeFilter: FilterEqualTypeInput!
        $fashionStyleFilter: FilterEqualTypeInput!
        $hasVideoFilter:FilterEqualTypeInput!
        $fashionPriceFilter:FilterRangeTypeInput!
    ) {
        products(filter: { category_uid: $categoryIdFilter,
            fashion_color:$fashionColorFilter,
            fashion_material:$fashionMaterialFilter,
            fashion_size:$fashionSizeFilter,
            fashion_style:$fashionStyleFilter,
            has_video:$hasVideoFilter,
            price:$fashionPriceFilter
         }) {
            aggregations {
                label
                count
                attribute_code
                options {
                    label
                    count
                    value
                }
                position
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
                url_key
                url_path
            }
        }
    }
`;

export const GET_CATEGORY_AVAILABLE_SORT_METHODS = gql`
    query getCategoryAvailableSortMethods(
        $categoryIdFilter: FilterEqualTypeInput!
    ) {
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

export default {
    getCategoryContentQuery: GET_CATEGORY_CONTENT,
    getProductFiltersByCategoryQuery: GET_PRODUCT_FILTERS_BY_CATEGORY,
    getCategoryAvailableSortMethodsQuery: GET_CATEGORY_AVAILABLE_SORT_METHODS
};
