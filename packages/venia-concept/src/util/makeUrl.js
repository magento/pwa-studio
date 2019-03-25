// ensure there's exactly one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

const mediaBases = new Map()
    .set(
        'image-product',
        process.env.MAGENTO_BACKEND_MEDIA_PATH_PRODUCT ||
            '/media/catalog/product'
    )
    .set(
        'image-category',
        process.env.MAGENTO_BACKEND_MEDIA_PATH_CATEGORY ||
            '/media/catalog/category'
    );

const resizeBase = joinUrls(
    process.env.IMAGE_SERVICE_PATH || '/img/',
    '/resize/'
);
/**
 * Creates an "optimized" url for a provided absolute or relative url based on
 * requested media type and width.
 *
 * If a `type` is provided the `path` will be joined with the associated media
 * base.
 *  - "/media/catalog/product/some/path/to/img.jpg"
 *
 * If a `width` is provided a "resize url" is returned using the desired width
 * and original media url.
 *  - /img/resize/640?url=%2Fmedia%2Fcatalog%2Fproduct%2Fsome%2Fpath%2Fto%2F/image.jpg
 *
 * If only `path` is provided it is returned unaltered.
 *
 * @param {string} path - absolute or relative url to resource.
 * @param {Object} props - properties describing desired optimizations
 * @param {string} props.type - "image-product" or "image-category"
 * @param {number} props.width - the desired resize width of the image
 */
const makeOptimizedUrl = (path, { type, width } = {}) => {
    const { location } = window;
    const urlObject = new URL(path, location.href);
    const params = new URLSearchParams(urlObject.search);

    if (type) {
        if (!mediaBases.has(type)) {
            throw new Error(`Unrecognized media type ${type}`);
        }

        const mediaBase = mediaBases.get(type);

        // prepend media base if it isn't already part of the pathname
        if (!urlObject.pathname.includes(mediaBase)) {
            urlObject.pathname = joinUrls(mediaBase, urlObject.pathname);
        }

        // check for width before returning
    }

    if (width) {
        // set pathname as query param
        // encodeURIComponent would be redundant
        params.set('url', urlObject.pathname);

        return `${resizeBase}${width}?${params}`;
    }

    // return unaltered path if we didn't operate on it
    return type ? urlObject.pathname : path;
};

export default makeOptimizedUrl;
