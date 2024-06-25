const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

export const isSupportedProductType = productType => {
    return SUPPORTED_PRODUCT_TYPES.includes(productType);
};
