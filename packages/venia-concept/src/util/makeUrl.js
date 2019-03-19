// test if a URL begins with `http://` or `https://` or `data:`
const absoluteUrl = /^(data|https|http)?:/i;

// ensure there's exactly one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

// TODO: make this even more dynamic, like an open registry
const mediaPathPrefixes = new Map()
    .set(
        'image-product',
        process.env.MAGENTO_BACKEND_MEDIA_PATH_PRODUCT ||
            '/media/catalog/product'
    )
    .set(
        'image-category',
        process.env.MAGENTO_BACKEND_MEDIA_PATH_CATALOG ||
            '/media/catalog/category'
    );

const prependMediaPath = (url, type) => {
    // only prepend to relative URLs of recognized type
    if (absoluteUrl.test(url) || !type) {
        return url;
    }

    // throw if type is unrecognized
    if (!mediaPathPrefixes.has(type)) {
        throw new Error(`Unrecognized media type ${type}`);
    }

    // prepend media directory to path
    return joinUrls(mediaPathPrefixes.get(type), url);
};

// default to `/img/resize`
const resizeBase = joinUrls(
    process.env.IMAGE_SERVICE_PATH || '/img/',
    '/resize/'
);

const makeOptimizedUrl = (path, width, useFastly) => {
    const urlObject = new URL(path, window.location.href);
    const params = new URLSearchParams(urlObject.search);

    if (useFastly) {
        params.set('auto', 'webp');
        params.set('format', 'pjpg');

        if (width) {
            params.set('width', width);
        }

        urlObject.search = `?${params}`;
    } else if (width) {
        // set pathname, but retain origin
        urlObject.pathname = `${resizeBase}${width}`;

        // encodeURIComponent would be redundant
        params.set('url', path);

        urlObject.search = `?${params}`;
    }

    return urlObject.href;
};

const formatUrl = (url = '', { useFastly, type, width } = {}) =>
    makeOptimizedUrl(
        prependMediaPath(url, type),
        width,
        useFastly || process.env.USE_FASTLY
    );

export default formatUrl;
