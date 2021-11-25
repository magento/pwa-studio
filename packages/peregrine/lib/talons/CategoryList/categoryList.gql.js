import { gql } from '@apollo/client';

export const GET_STORE_CONFIG_DATA = gql`
    query GetStoreConfigForCategoryList {
        storeConfig {
            id
            category_url_suffix
        }
    }
`;

export const GET_CATEGORY_LIST = gql`
    query GetCategoryList($id: String!) {
        categories(filters: { ids: { in: [$id] } }) {
            items {
                uid
                children {
                    uid
                    name
                    url_key
                    url_path
                    children_count
                    path
                    image
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

export default {
    getCategoryListQuery: GET_CATEGORY_LIST,
    getStoreConfigQuery: GET_STORE_CONFIG_DATA
};
