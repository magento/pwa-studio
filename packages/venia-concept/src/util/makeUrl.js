// If the root template supplies the backend URL at runtime, use it directly
const {
    imageOptimizingOrigin,
    mediaBackend = 'https://backend.test/media/'
} = document.querySelector('html').dataset;
const useBackendForImgs = imageOptimizingOrigin === 'backend';

// Tests if a URL begins with `http:` or `https:` or `data:`
const absoluteUrl = /^(data|http|https)?:/i;

// Simple path joiner that guarantees one and only one slash between segments
const joinUrls = (base, url) =>
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url);

const mediaBases = new Map()
    .set('image-product', 'catalog/product/')
    .set('image-category', 'catalog/category/');

/**
 * Creates an "optimized" url for a provided relative url based on
 * requested media type and width. Any image URLs (whose type begins with
 * "image-" will also be optimized.)
 *
 * If a `type` is provided the `path` will be joined with the associated media
 * base.
 *  - `catalog/product/path/to/img.jpg`
 *
 * If a `width` is provided, "resize parameters" are added to the URL for
 * middlewares (either onboard or backend) to return using the desired width
 * and original media url.
 *  - `catalog/product/path/to/img.jpg?width=500&auto=webp&format=pjpg
 *
 * If only `path` is provided it is returned unaltered.
 *
 * @param {string} path - absolute or relative url to resource.
 * @param {Object} props - properties describing desired optimizations
 * @param {string} props.type - "image-product" or "image-category"
 * @param {number} props.width - the desired resize width of the image
 */
const makeOptimizedUrl = (path, { type, width } = {}) => {
    // Immediate return if there's no image optimization to attempt
    if (!type || !type.startsWith('image-')) {
        return path;
    }

    const { origin } = window.location;
    const isAbsolute = absoluteUrl.test(path);
    let baseURL = new URL(path, mediaBackend);

    // If URL is relative and has a supported type, prepend media base onto path
    if (!isAbsolute && mediaBases.has(type)) {
        const mediaBase = mediaBases.get(type);
        if (!baseURL.pathname.includes(mediaBase)) {
            baseURL = new URL(joinUrls(mediaBase, path), mediaBackend);
        }
    }

    if (baseURL.href.startsWith(mediaBackend) && !useBackendForImgs) {
        baseURL = new URL(baseURL.href.slice(baseURL.origin.length), origin);
    }

    // Append image optimization parameters
    const params = new URLSearchParams(baseURL.search);
    params.set('auto', 'webp'); // Use the webp format if available
    params.set('format', 'pjpg'); // Use progressive JPGs at least
    if (width) {
        // resize!
        params.set('width', width);
    }
    baseURL.search = params.toString();

    if (baseURL.origin === origin) {
        return baseURL.href.slice(baseURL.origin.length);
    }

    return baseURL.href;
};

export default makeOptimizedUrl;
