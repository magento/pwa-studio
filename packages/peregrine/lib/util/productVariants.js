/**
 * Find the full configurable option of a product that matches a variant's option label.
 *
 * @param {Object} An options object containing:
 * @param {Object} product: The full, configurable product
 * @param {Object} variantOption: An option of a simple product that is a variant of the full configurable product.
 *
 * @returns {Object or undefined} The configurable option of the product that matches the given variantOption label.
 * This object contains keys attribute_code, attribute_id, id, label, and an array of values.
 */
const findMatchingProductOption = ({ product, variantOption }) => {
    return product.configurable_options.find(productOption => {
        return variantOption.label === productOption.label;
    });
};

/**
 * Find the value object of a product's configurable option that matches a variant's option value.
 *
 * @param {Object} An options object containing:
 * @param {Object} product: The full, configurable product
 * @param {Object} variantOption: An option of a simple product that is a variant of the full configurable product.
 *
 * @returns {Object or undefined} A result object containing:
 *          {Object} option - The configurable option of the product that matches the given variantOption label.
 *              This object contains keys attribute_code, attribute_id, id, label, and an array of values.
 *          {Object} value  - The value of the option that matches the given variantOption value.
 *              This object contains keys default_label, label, store_label, use_default_value, and value_index.
 *
 *          Note: if either one of these matches cannot be found, undefined is returned.
 */
const findMatchingProductOptionValue = ({ product, variantOption }) => {
    const matchingProductOption = findMatchingProductOption({
        product,
        variantOption
    });

    if (!matchingProductOption) {
        return;
    }

    const matchingProductOptionValue = matchingProductOption.values.find(
        productOptionValue => {
            const targetProperty = productOptionValue.use_default_value
                ? 'default_label'
                : 'label';

            return productOptionValue[targetProperty] === variantOption.value;
        }
    );

    if (!matchingProductOptionValue) {
        return;
    }

    return {
        option: matchingProductOption,
        value: matchingProductOptionValue
    };
};

export { findMatchingProductOption, findMatchingProductOptionValue };
