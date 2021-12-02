import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForCategoryList {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            category_url_suffix
        }
    }
`;

export const GET_CATEGORY_LIST = gql`
    query GetCategoryList($id: Int!) {
        category(id: $id) {
            id
            children {
                id
                name
                url_key
                url_path
                children_count
                path
                image
                productImagePreview: products(pageSize: 1) {
                    items {
                        id
                        small_image {
                            url
                        }
                    }
                }
            }
        }
    }
`;

export default {
    getCategoryListQuery: GET_CATEGORY_LIST,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
