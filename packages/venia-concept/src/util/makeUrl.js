const absoluteUrlRE = /^(?:https?|data|file):/;

// If the root template supplies the backend URL at runtime, use it directly
const htmlTag = document.querySelector('html');
const fastlyOrigin = (htmlTag && htmlTag.dataset.fastlyOrigin) || '';

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
 * "image-" will also be optimized by default unless the `optimize` option is
 * set to false.)
 *
 * If a `type` is provided the `path` will be joined with the associated media
 * base.
 *  - `/media/catalog/product/path/to/img.jpg`
 *
 * If a `width` is provided, "resize parameters" are added to the URL for
 * middlewares (either onboard or Fastly) to return using the desired width
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
    const isAbsolute = absoluteUrlRE.test(path);
    const shouldOptimizeByDefault =
        !isAbsolute && type && type.startsWith('image-');
    const fastlyBase = shouldOptimizeByDefault && fastlyOrigin;
    const baseUrl = fastlyBase || window.location.href;

    const urlObject = new URL(path, baseUrl);
    const params = new URLSearchParams(urlObject.search);

    if (!isAbsolute && type && mediaBases.has(type)) {
        const mediaBase = mediaBases.get(type);
        // prepend media base if it isn't already part of the pathname
        if (!urlObject.pathname.includes(mediaBase)) {
            urlObject.pathname = mediaBase + urlObject.pathname;
        }
    }

    if (shouldOptimizeByDefault) {
        params.set('auto', 'webp'); // Use the modern webp format if available
        params.set('format', 'pjpg'); // Use progressive JPGs at least
    }

    if (width) {
        // resize!
        params.set('width', width);
    }

    urlObject.search = params.toString();
    if (urlObject.origin === window.location.origin) {
        return urlObject.href.slice(window.location.origin.length);
    }
    return urlObject.href;
};

export default makeOptimizedUrl;
