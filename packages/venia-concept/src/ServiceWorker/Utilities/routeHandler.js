/**
 * Checks if the given URL object belongs to the home route.
 *
 * @param {URL} url
 *
 * @returns {boolean}
 */
export const isHomeRoute = url => {
    if (url.pathname === '/') {
        return true;
    }

    // If store code is in the url, the home route will be url.com/view_code.
    // A trailing / may or may not follow.
    if (process.env.USE_STORE_CODE_IN_URL === 'true') {
        return AVAILABLE_STORE_VIEWS.some(
            ({ code }) =>
                url.pathname === `/${code}/` || url.pathname === `/${code}`
        );
    }
};

/**
 * Checks if the given URL object belongs to the home route `/`
 * or has a `.html` extension.
 *
 * @param {URL} url
 *
 * @returns {boolean}
 */
export const isHTMLRoute = url =>
    isHomeRoute(url) || new RegExp('\\.html$').test(url.pathname);
