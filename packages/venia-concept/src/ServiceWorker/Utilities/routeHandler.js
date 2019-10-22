/**
 * Checks if the given URL object belongs to the home route `/`.
 *
 * @param {URL} url
 *
 * @returns {boolean}
 */
export const isHomeRoute = url => url.pathname === '/';

/**
 * Checks if the given URL object belongs to the home route `/`
 * or has a `.html` extension.
 *
 * @param {URL} url
 *
 * @returns {boolean}
 */
export const isHTMLRoute = url =>
    isHomeRoute(url) || new RegExp('.html$').test(url.pathname);
