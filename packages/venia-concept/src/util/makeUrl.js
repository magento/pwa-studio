// If the root template supplies the backend URL at runtime, use it directly
const { imageOptimizingOrigin, backend } = document.querySelector(
    'html'
).dataset;
const useBackendForImgs = backend && imageOptimizingOrigin === 'backend';

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

/**
 * Creates an "optimized" url for a provided absolute or relative url based on
 * requested media type and width. Any image URLs (whose type begins with
 * "image-" will also be optimized.)
 *
 * If a `type` is provided the `path` will be joined with the associated media
 * base.
 *  - `/media/catalog/product/path/to/img.jpg`
 *
 * If a `width` is provided, "resize parameters" are added to the URL for
 * middlewares (either onboard or backend) to return using the desired width
 * and original media url.
 *  - `/media/catalog/product/path/to/img.jpg?width=500&auto=webp&format=pjpg
 *
 * If only `path` is provided it is returned unaltered.
 *
 * @param {string} path - absolute or relative url to resource.
 * @param {Object} props - properties describing desired optimizations
 * @param {string} props.type - "image-product" or "image-category"
 * @param {number} props.width - the desired resize width of the image
 */
const makeOptimizedUrl = (path, { type, width } = {}) => {
    const { href, origin } = window.location;
    let urlObject = new URL(path, href);

    if (type) {
        if (mediaBases.has(type)) {
            const mediaBase = mediaBases.get(type);
            // prepend media base if it isn't already part of the pathname
            if (!urlObject.pathname.includes(mediaBase)) {
                urlObject.pathname = mediaBase + urlObject.pathname;
            }
        }
        // add image optimization parameters and optionally change origin
        if (type.startsWith('image-')) {
            if (useBackendForImgs) {
                urlObject = new URL(
                    urlObject.href.slice(urlObject.origin.length),
                    backend
                );
            } else if (path.startsWith(backend) && !useBackendForImgs) {
                // Some API responses include absolute URLs to images.
                // The backend won't optimize images, so do not use this
                // absolute URL; instead, use a relative URL which has a chance
                // of being passed through image optimization.
                urlObject = new URL(path.slice(backend.length), origin);
            }
            const params = new URLSearchParams(urlObject.search);
            params.set('auto', 'webp'); // Use the webp format if available
            params.set('format', 'pjpg'); // Use progressive JPGs at least
            if (width) {
                // resize!
                params.set('width', width);
            }
            urlObject.search = params.toString();
        }
    }

    if (urlObject.origin === origin) {
        return urlObject.href.slice(origin.length);
    }
    return urlObject.href;
};

export default makeOptimizedUrl;
