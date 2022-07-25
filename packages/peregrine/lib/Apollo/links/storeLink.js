import { setContext } from '@apollo/client/link/context';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export default function createStoreLink() {
    return setContext((_, { headers }) => {
        const storeCurrency = storage.getItem('store_view_currency') || null;
        const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

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
