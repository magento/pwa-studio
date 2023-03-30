import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';

export const GET_PRODUCT_DETAIL_FOR_PRODUCT_PAGE_BY_URL_KEY = gql`
    query GetProductDetailForProductPageByUrlKey($urlKey: String!) {
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
    getProductDetailQuery: GET_PRODUCT_DETAIL_FOR_PRODUCT_PAGE_BY_URL_KEY
};
