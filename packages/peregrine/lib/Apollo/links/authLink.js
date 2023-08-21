import { setContext } from '@apollo/client/link/context';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();
const LOCAL_STORAGE_KEY = 'magento_cache_id';
export default function createAuthLink() {
    return setContext((_, { headers }) => { 
        const dd = storage.getItem(LOCAL_STORAGE_KEY);
        console.log(dd + 'sad');
        // get the authentication token from local storage if it exists.
        const token = storage.getItem('signin_token');

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });
}
