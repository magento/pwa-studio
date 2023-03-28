import { setContext } from '@apollo/client/link/context';
import { Cookie, BrowserPersistence } from '@magento/peregrine/lib/util';
import { getStoreDataFromUrl } from '@magento/venia-ui/lib/components/StoreCodeRoute';

const storage = new BrowserPersistence();

export default function createStoreLink() {
    return setContext((_, { headers }) => {
        const {
            storeCode = STORE_VIEW_CODE,
            storeCurrency: storeCurrencyFromUrl
        } = getStoreDataFromUrl(globalThis.location.pathname);

        const storeCurrency =
            Cookie.get('store_view_currency') ||
            storage.getItem('store_view_currency') ||
            storeCurrencyFromUrl;

        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                store: storeCode,
                ...(storeCurrency && {
                    'Content-Currency': storeCurrency
                })
            }
        };
    });
}
