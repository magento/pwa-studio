/**
 * Map Magento 2.3.1 schema changes to Venia 2.0.0 proptype shape
 * to maintain backwards compatibility.
 *
 * Note: Clone the product object, _DO NOT_ modify the original.
 *
 * @param {Product} product
 *
 * @returns {MappedProduct} a clone of the incoming product with backwards compatible fields.
 */
const mapProduct = product => {
    const { description, small_image } = product;

    const newDescription =
        typeof description === 'object' ? description.html : description;
    const newSmallImage =
        typeof small_image === 'object' ? small_image.url : small_image;

    return {
        ...product,
        description: newDescription,
        small_image: newSmallImage
    };
};

export default mapProduct;
