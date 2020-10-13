import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
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
    const storeCurrencies = {};

    AVAILABLE_STORE_VIEWS.forEach(store => {
        storeCodes.push(store.code);
        storeCurrencies[store.code] = store.default_display_currency_code;
    });

    // Sort by length (longest first) to avoid false hits ie "en" matching just
    // the "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    storeCodes.sort((a, b) => b.length - a.length);

    const pattern = `/:storeCode(${storeCodes.join('|')})?`;
    const match = useRouteMatch(pattern);

    useEffect(() => {
        // The current store code won't be matched as it's included as the
        // basename, if we match another store we need to change the current
        // store.
        if (match.params.storeCode) {
            // Only execute if one store code is present in the URL, multiple
            // store codes will cause the store state to break and cause weird
            // side effects for the user.
            const regex = new RegExp(`\/(${storeCodes.join('|')})`, 'g');
            const storeCodesInUrl = window.location.pathname.match(regex);
            if (storeCodesInUrl && storeCodesInUrl.length === 1) {
                storage.setItem('store_view_code', match.params.storeCode);
                storage.setItem(
                    'store_view_currency',
                    storeCurrencies[match.params.storeCode]
                );

                // We're required to reload the page as the basename doesn't
                // change entirely without a full page reload.
                history.go(0);
            } else {
                console.warn('Multiple store codes present in URL.');
            }
        }
    }, [history, match.params.storeCode, storeCodes, storeCurrencies]);

    return null;
};

export default StoreCodeRoute;
