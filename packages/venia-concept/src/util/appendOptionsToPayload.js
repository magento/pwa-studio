const appendOptionsToPayload = (
    payload,
    optionSelections,
    optionCodes = null
) => {
    const { item } = payload;
    const { variants } = item;

    if (!optionCodes) {
        optionCodes = new Map();
        for (const option of item.configurable_options) {
            optionCodes.set(option.attribute_id, option.attribute_code);
        }
    }

    const options = Array.from(optionSelections, ([id, value]) => ({
        option_id: id,
        option_value: value
    }));

    const selectedVariant = variants.find(({ attributes, product }) => {
        for (const [id, value] of optionSelections) {
            const code = optionCodes.get(id);

            // check `product` for standard attributes
            // check `attributes` for custom attributes
            if (
                product[code] !== value &&
                !attributes.some(
                    attribute =>
                        attribute.code === code &&
                        attribute.value_index === value
                )
            ) {
                return false;
            }
        }

        return true;
    });

    if (!selectedVariant) return payload;

    Object.assign(payload, {
        options,
        parentSku: item.sku,
        item: Object.assign({}, selectedVariant.product)
    });

    return payload;
};

export default appendOptionsToPayload;
