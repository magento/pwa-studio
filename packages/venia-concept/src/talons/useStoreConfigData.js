import { gql, useQuery } from '@apollo/client';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

export const useStoreConfigData = props => {
    // const storage = new BrowserPersistence();
    const { data: storeConfigData } = useQuery(GET_STORE_CONFIG_DATA, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // if (storeConfigData) {
    //     storage.setItem(
    //         'is_required_login',
    //         storeConfigData.storeConfig.is_required_login
    //     );
    // }

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
