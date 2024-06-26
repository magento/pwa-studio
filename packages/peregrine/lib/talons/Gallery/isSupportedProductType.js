const SUPPORTED_PRODUCT_TYPES = [
    'SimpleProduct',
    'ConfigurableProduct',
    'configurable',
    'simple'
];

export const isSupportedProductType = productType => {
    return SUPPORTED_PRODUCT_TYPES.includes(productType);
};
