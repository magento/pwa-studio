/**
 * Extract the basename from a URL object, which corresponds to the `url_key`
 * property of a Magento 2 GraphQL entity. Mostly used to get the url_key
 * from a recently navigated-to URL.
 *
 * @param {URL} url
 * @returns {string} A string for use as the `url_key` in a GraphQL query.
 */
export default function getUrlKey(url = window.location) {
    // The URL key is the last path segment.
    const basename = url.pathname.slice(url.pathname.lastIndexOf('/') + 1);
    // TODO: this may be configurable, but Magento SEO urls appear to always
    // append `.html`, which is not part of the URL key. So strip it.
    return basename.replace(/\.html$/, '');
}
