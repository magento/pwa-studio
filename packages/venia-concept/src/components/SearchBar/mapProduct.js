/*
 * Map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape
 * to maintain backwards compatibility.
 *
 * TODO: deprecate and remove
 */

export default product => {
    const { small_image } = product;

    return {
        ...product,
        small_image:
            typeof small_image === 'object' ? small_image.url : small_image
    };
};
