import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';

import { GET_STORE_CONFIG_DATA } from '../../StoreConfig/storeConfig.gql';

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPageProduct($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
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
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
};
