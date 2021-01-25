import { gql } from '@apollo/client';

export const GET_CHECKMO_CONFIGDATA = gql`
    query storeConfigData {
        storeConfig {
            payment_checkmo_payable_to @client
            payment_checkmo_mailing_address @client
        }
    }
`;

export default {
    getCheckmoConfigQuery: GET_CHECKMO_CONFIGDATA
};
