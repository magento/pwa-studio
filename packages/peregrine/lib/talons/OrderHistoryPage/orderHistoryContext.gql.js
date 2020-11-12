import { gql } from '@apollo/client';

const GET_PRODUCT_URL_SUFFIX = gql`
    query GetProductURLSuffix {
        storeConfig {
            id
            product_url_suffix
        }
    }
`;

export default {
    getProductURLSuffixQuery: GET_PRODUCT_URL_SUFFIX
};
