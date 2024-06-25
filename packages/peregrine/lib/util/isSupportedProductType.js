const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct','configurable','bumdled','simple'];

export const isSupportedProductType = productType => {
    return SUPPORTED_PRODUCT_TYPES.includes(productType);
};
