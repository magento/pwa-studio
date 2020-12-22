// Resolves configured variant for configurable cart item.
// This field is proposed in the https://github.com/magento/magento2/pull/30817
export default function configuredVariant(configured_options, product) {
    if (!configured_options || !product.variants) return;
    const optionUids = configured_options
        .map(option => {
            return Buffer.from(
                `configurable/${option.id}/${option.value_id}`
            ).toString('base64');
        })
        .sort()
        .toString();

    return product.variants
        .map(variant => {
            const variantUids = variant.attributes
                .map(attribute => attribute.uid)
                .sort()
                .toString();
            return variantUids === optionUids && variant.product;
        })
        .filter(Boolean)[0];
}
