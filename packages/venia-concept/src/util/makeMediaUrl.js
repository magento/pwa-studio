import memoize from 'lodash/memoize';

// Tests if a URL begins with `http://` or `https://` or `data:`
const absoluteUrl = /^(data|https)?:/i;

// Simple path joiner that guarantees one and only one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

// TODO: make this even more dynamic, like an open registry
const mediaPathPrefixes = {
    product:
        process.env.MAGENTO_BACKEND_MEDIA_PATH_PRODUCT ||
        '/media/catalog/product',
    category:
        process.env.MAGENTO_BACKEND_MEDIA_PATH_CATALOG ||
        '/media/catalog/category'
};

// Should produce `/img/resize` in the default case
const resizeBase = joinUrls(process.env.IMAGE_SERVICE_PATH || '/img', 'resize');

// `makeResizedUrl("/path/to/jpeg", { width: 80 })` returns
// "/img/resize/80?url=%2Fpath%2fto%2fjpeg"
function makeResizedUrl(url, width) {
    return `${joinUrls(resizeBase, width.toString())}?url=${encodeURIComponent(
        url
    )}`;
}

// Should fail silently on a null value, so default to the empty string
// so that string methods work
function makeMediaUrl(url = '', opts = {}) {
    const { type, width } = opts;
    if (absoluteUrl.test(url) || !(type || width)) {
        // Absolute URLs shouldn't be resized
        // Without a type or a width, we don't know how to transform this url
        return url;
    }

    // we need to throw on an unrecognized `type`, so we may have to assign this
    // in another code branch, hence the "let"
    let formattedUrl = url;

    if (type) {
        if (!mediaPathPrefixes.hasOwnProperty(type)) {
            throw new Error(`Unrecognized media type ${type}`);
        }
        // "/path/to/jpeg" becomes e.g. "/media/catalog/product/path/to/jpeg"
        formattedUrl = joinUrls(mediaPathPrefixes[type], url);
    }

    // if a width exists, make a resized URL!
    return width ? makeResizedUrl(formattedUrl, width) : formattedUrl;
}

// Each combination of type, url, and width is computed only once and cached.
// storeUrlKey defines the cache key as a function of the arguments.
const storeUrlKey = (url, { width = '', type = '' } = {}) =>
    `${type}%%${url}%%${width}`;

export default memoize(makeMediaUrl, storeUrlKey);
