import { gql, useQuery } from '@apollo/client';

export const useStoreConfigData = () => {
    const { data: storeConfigData } = useQuery(GET_STORE_CONFIG_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    return {
        storeConfigData
    };
};
export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            is_required_login
            store_code
            product_url_suffix
        }
    }
`;
