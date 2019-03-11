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
        const customAttributes = (attributes || []).reduce(
            (map, { code, value_index }) => new Map(map).set(code, value_index),
            new Map()
        );

        for (const [id, value] of optionSelections) {
            const code = optionCodes.get(id);
            const matchesStandardAttribute = product[code] === value;
            const matchesCustomAttribute = customAttributes.get(code) === value;

            // if any option selection fails to match any standard attribute
            // and also fails to match any custom attribute
            // then this isn't the correct variant
            if (!matchesStandardAttribute && !matchesCustomAttribute) {
                return false;
            }
        }

        // otherwise, every option selection matched
        // and this is the correct variant
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
