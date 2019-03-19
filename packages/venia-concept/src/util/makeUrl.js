// ensure there's exactly one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

const stripMagentoOrigin = url => {
    const origin = process.env.MAGENTO_BACKEND_URL;

    return origin && url.startsWith(origin) ? new URL(url).pathname : url;
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

const formatUrl = (url = '', { useFastly, width } = {}) =>
    makeOptimizedUrl(
        stripMagentoOrigin(url),
        width,
        useFastly || process.env.USE_FASTLY
    );

export default formatUrl;
