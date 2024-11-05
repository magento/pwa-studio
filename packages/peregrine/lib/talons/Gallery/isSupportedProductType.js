const SUPPORT_PRODUCT_TYPES = ['SimpleProduct','ConfigurableProduct','configurable','simple'
];

export const isSupportedProductType = productType => {
    return SUPPORT_PRODUCT_TYPES.includes(productType);
};
