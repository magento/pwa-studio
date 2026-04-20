import { findAllMatchingVariants } from '@magento/peregrine/lib/util/findAllMatchingVariants';

const IN_STOCK_CODE = 'IN_STOCK';

/**
 * Returns configurable `value_index` values that cannot extend the current
 * partial selection into any salable (in stock) variant.
 *
 * This replaces the older heuristic that disabled any value appearing on an
 * OOS variant that partially overlapped the selection — which incorrectly greyed
 * out values that still participate in a different in-stock combination.
 *
 * @param {object} product
 * @param {Map} optionCodes attribute_id -> attribute_code
 * @param {Map} optionSelections attribute_id -> selected value_index | undefined
 * @param {Array} variants variants array already resolved for stock-display mode
 * @returns {number[]|string[]} distinct unavailable value_index values
 */
export const getUnavailableConfigurableValues = (
    product,
    optionCodes,
    optionSelections,
    variants
) => {
    const inStockVariants = variants.filter(
        v => v.product?.stock_status === IN_STOCK_CODE
    );

    if (!inStockVariants.length) {
        return [];
    }

    const unavailable = new Set();
    const options = product.configurable_options || [];

    for (const { attribute_id, values } of options) {
        const attrKey = String(attribute_id);

        for (const { value_index: candidate } of values) {
            const currentForAttr = optionSelections.get(attrKey);
            if (
                currentForAttr !== undefined &&
                currentForAttr !== null &&
                String(currentForAttr) === String(candidate)
            ) {
                continue;
            }

            const testSelections = new Map();

            for (const [id, val] of optionSelections) {
                if (val !== undefined && val !== null) {
                    testSelections.set(String(id), val);
                }
            }
            testSelections.set(attrKey, candidate);

            const matches = findAllMatchingVariants({
                optionCodes,
                singleOptionSelection: testSelections,
                variants: inStockVariants
            });

            if (!matches.length) {
                unavailable.add(candidate);
            }
        }
    }

    return Array.from(unavailable);
};
