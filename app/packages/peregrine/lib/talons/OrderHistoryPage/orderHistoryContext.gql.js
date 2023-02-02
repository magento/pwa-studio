import { gql } from '@apollo/client';

const GET_PRODUCT_URL_SUFFIX = gql`
    query GetProductURLSuffix {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export default {
    getProductURLSuffixQuery: GET_PRODUCT_URL_SUFFIX
};
