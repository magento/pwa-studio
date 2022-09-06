import { gql, useQuery } from '@apollo/client';

export const useStoreConfigData = props => {
    const { data: storeConfigData } = useQuery(GET_STORE_CONFIG_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    console.log('storeConfigData', storeConfigData);

    return {
        storeConfigData
    };
};
export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            is_required_login
            store_code
            product_url_suffix
        }
    }
`;
