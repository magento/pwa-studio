export const isSupportedProductType = productType => {
    const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

    return SUPPORTED_PRODUCT_TYPES.includes(productType);
};
