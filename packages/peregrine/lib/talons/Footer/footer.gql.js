import { gql } from '@apollo/client';

export const GET_COPYRIGHT = gql`
    query storeConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            copyright
        }
    }
`;

export default {
    getCopyrightQuery: GET_COPYRIGHT
};
