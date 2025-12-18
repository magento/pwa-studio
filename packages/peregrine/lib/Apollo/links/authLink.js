import { setContext } from '@apollo/client/link/context';
import {
    BrowserPersistence,
    getTokenFromCookie,
    shouldPreferCookies
} from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export default function createAuthLink() {
    return setContext((_, { headers }) => {
        let token = null;

        // In standalone PWA mode (e.g., iOS home screen app), prefer cookies
        // because localStorage is not shared between browser and PWA
        if (shouldPreferCookies()) {
            token = getTokenFromCookie();
        }

        // Fallback to localStorage (existing behavior)
        if (!token) {
            token = storage.getItem('signin_token');
        }

        // Return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : ''
            }
        };
    });
}
