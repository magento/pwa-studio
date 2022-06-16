import { useQuery } from '@apollo/client';
import useStoreConfigRequiredLoginGql from './useStoreConfigRequiredLogin.gql';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
const storage = new BrowserPersistence();

const useStoreConfigRequiredLogin = async props => {
    const { getIsRequiredLogin } = useStoreConfigRequiredLoginGql;

    let _is_required_login = false;

    const { data: storeConfig } = await useQuery(getIsRequiredLogin, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    if (storeConfig) {
        const {
            storeConfig: { is_required_login }
        } = storeConfig;

        if (is_required_login == '1') {
            _is_required_login = true;
        }
    }

    storage.setItem('is_required_login', _is_required_login);
};

export default useStoreConfigRequiredLogin;
