/**
 *
 * @param {string} pathname
 * @returns {{storeCode: string, storeCurrency: string}}
 */
export const getStoreDataFromUrl = pathname => {
    const storeCodes = [];
    const storeCurrencies = {};

    AVAILABLE_STORE_VIEWS.forEach(store => {
        storeCodes.push(store.code);
        storeCurrencies[store.code] = store.default_display_currency_code;
    });

    // Sort by length (longest first) to avoid false hits ie "en" matching just
    // the "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
    storeCodes.sort((a, b) => b.length - a.length);

    // Find the store code in the url. This will always be the first path.
    // ie `https://example.com/fr/foo/baz.html` => `fr`.
    const regex = new RegExp(`^\/(${storeCodes.join('|')})`, 'g');
    const match = pathname.match(regex);
    const storeCode = match && match[0].replace(/\//g, '');

    return {
        storeCode: storeCode || STORE_VIEW_CODE,
        storeCurrency: storeCurrencies[storeCode]
    };
};
