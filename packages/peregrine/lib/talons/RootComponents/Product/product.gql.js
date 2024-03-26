import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export const GET_SINGLE_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($sku: String!) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                id
                uid
                ...ProductDetailsFragment
            }
        }
    }
    ${ProductDetailsFragment}
`;

export default {
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getSingleProductDetailQuery: GET_SINGLE_PRODUCT_DETAIL_QUERY
};
