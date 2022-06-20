import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

/**
 * This component checks for use of a store code in the url that is not the
 * current base. If found, it updates the local storage values for code/currency
 * and reloads the page so that they are used in the graphQL headers.
 */
const StoreCodeRoute = () => {
    const history = useHistory();

    const storeCodes = [];
    const storeCurrencies = useMemo(() => ({}), []);
    const storeSecureBaseMediaUrl = useMemo(() => ({}), []);

    AVAILABLE_STORE_VIEWS.forEach(store => {
        storeCodes.push(store.store_code);
        storeCurrencies[store.store_code] = store.default_display_currency_code;
        storeSecureBaseMediaUrl[store.store_code] = store.secure_base_media_url;
    });

    // Sort by length (longest first) to avoid false hits ie "en" matching just
    // the "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    storeCodes.sort((a, b) => b.length - a.length);

    // Find the store code in the url. This will always be the first path.
    // ie `https://example.com/fr/foo/baz.html` => `fr`.
    const regex = new RegExp(`^\/(${storeCodes.join('|')})`, 'g');
    const { location } = globalThis;
    const match = location && location.pathname.match(regex);
    const storeCodeInUrl = match && match[0].replace(/\//g, '');

    // Determine what the current store code is using the configured basename.
    const basename = history.createHref({ pathname: '/' });
    const currentStoreCode = basename.replace(/\//g, '');

    // If we find a store code in the url that is not the current one, update
    // the storage value and refresh so that we start using the new code.
    useEffect(() => {
        if (storeCodeInUrl && storeCodeInUrl !== currentStoreCode) {
            storage.setItem('store_view_code', storeCodeInUrl);
            storage.setItem(
                'store_view_currency',
                storeCurrencies[storeCodeInUrl]
            );
            storage.setItem(
                'store_view_secure_base_media_url',
                storeSecureBaseMediaUrl[storeCodeInUrl]
            );

            // We're required to reload the page as the basename doesn't
            // change entirely without a full page reload.
            history.go(0);
        }
    }, [
        currentStoreCode,
        history,
        storeCodeInUrl,
        storeCurrencies,
        storeSecureBaseMediaUrl
    ]);

    return null;
};

export default StoreCodeRoute;
