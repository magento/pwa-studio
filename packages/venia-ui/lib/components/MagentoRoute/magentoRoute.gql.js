import { gql } from '@apollo/client';

export const GET_STORE_CODE = gql`
    query getStoreCode {
        storeConfig {
            id
            code
        }
    }
`;

export default {
    queries: {
        getStoreCode: GET_STORE_CODE
    }
};
