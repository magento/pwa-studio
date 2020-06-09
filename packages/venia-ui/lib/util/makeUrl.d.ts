export default makeOptimizedUrl;
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
 * @param {number} props.height - the desired resize height of the image
 * @param {number} props.quality - the desired quality of the image
 * @param {bool} props.crop - should the image be cropped
 * @param {string} props.fit - how should the image be fit with the dimensions: bounds, cover, crop
 */
declare function makeOptimizedUrl(path: string, { type, ...opts }?: {
    type: string;
    width: number;
    height: number;
    quality: number;
    crop: any;
    fit: string;
}): string;
