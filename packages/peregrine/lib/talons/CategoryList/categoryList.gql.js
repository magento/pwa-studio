/* Deprecated in PWA-12.1.0*/

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
    query GetCategoryList($id: String!) {
        categories(filters: { category_uid: { in: [$id] } }) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            items {
                uid
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                children {
                    uid
                    name
                    url_key
                    url_path
                    children_count
                    path
                    image
                    productImagePreview: products(pageSize: 1) {
                        # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
