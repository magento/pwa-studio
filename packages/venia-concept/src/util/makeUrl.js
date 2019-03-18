import memoize from 'lodash/memoize';

// Tests if a URL begins with `http://` or `https://` or `data:`
const absoluteUrl = /^(data|https|http)?:/i;

// Simple path joiner that guarantees one and only one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

// TODO: make this even more dynamic, like an open registry
const mediaPathPrefixes = {
    'image-product':
        process.env.MAGENTO_BACKEND_MEDIA_PATH_PRODUCT ||
        '/media/catalog/product',
    'image-category':
        process.env.MAGENTO_BACKEND_MEDIA_PATH_CATALOG ||
        '/media/catalog/category'
};
function ensurePathPrefix(url, type) {
    // Can't prepend to absolute URLs, and don't know how to prepend if no type.
    if (absoluteUrl.test(url) || !type) {
        return url;
    }

    if (!mediaPathPrefixes.hasOwnProperty(type)) {
        throw new Error(`Unrecognized media type ${type}`);
    }
    // "/path/to/jpeg" becomes e.g. "/media/catalog/product/path/to/jpeg"
    return joinUrls(mediaPathPrefixes[type], url);
}

let resizeBase;
function makeOptimizedUrl(url, width) {
    if (process.env.USE_FASTLY) {
        // `makeResizedUrl("/path/to/jpeg?queryParam=1", { width: 80 })` returns
        // "/path/to/jpeg?queryParam=1&auto=webp&format=pjpg&width=80"
        const urlObject = new URL(url, window.location.href);
        const params = new URLSearchParams(urlObject.search);
        params.set('auto', 'webp');
        params.set('format', 'pjpg');
        if (width) {
            params.set('width', width);
        }
        urlObject.search = '?' + params;
        return urlObject.href;
    } else {
        // `makeResizedUrl("/path/to/jpeg", { width: 80 })` returns
        // "/img/resize/80?url=%2Fpath%2fto%2fjpeg"

        resizeBase =
            resizeBase ||
            joinUrls(process.env.IMAGE_SERVICE_PATH || '/img', 'resize/');
        return width
            ? `${resizeBase}${width}?url=${encodeURIComponent(url)}`
            : url;
    }
}

// Should fail silently on a null value, so default to the empty string
// so that string methods work
function formatUrl(url = '', opts = {}) {
    const { type, width } = opts;
    return makeOptimizedUrl(ensurePathPrefix(url, type), width);
}

// Each combination of type, url, and width is computed only once and cached.
// storeUrlKey defines the cache key as a function of the arguments.
const storeUrlKey = (url, { width = '', type = '' } = {}) =>
    `${type}%%${url}%%${width}`;

export default memoize(formatUrl, storeUrlKey);
