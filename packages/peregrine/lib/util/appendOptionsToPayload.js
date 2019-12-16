import { findMatchingVariant } from './findMatchingProductVariant';

/**
 * TODO Document
 */
export const appendOptionsToPayload = (
    payload,
    optionSelections,
    optionCodes = null
) => {
    const { item } = payload;
    const { variants } = item;

    if (!optionCodes) {
        optionCodes = new Map();
        for (const option of item.configurable_options) {
            // There's a type difference in configurable option queries between
            // cart and product, casting to number is required. Can remove
            // cast once MC-29839 is resolved.
            optionCodes.set(Number(option.attribute_id), option.attribute_code);
        }
    }

    const options = Array.from(optionSelections, ([id, value]) => ({
        option_id: id,
        option_value: value
    }));

    const selectedVariant = findMatchingVariant({
        variants,
        optionCodes,
        optionSelections
    });

    if (!selectedVariant) return payload;

    Object.assign(payload, {
        options,
        parentSku: item.sku,
        item: Object.assign({}, selectedVariant.product)
    });

    return payload;
};
