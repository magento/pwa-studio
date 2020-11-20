import { gql } from '@apollo/client';

import { ProductDetailsFragment } from './productDetailFragment.gql';

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                ...ProductDetailsFragment
            }
        }
    }
    ${ProductDetailsFragment}
`;

export default {
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
};
