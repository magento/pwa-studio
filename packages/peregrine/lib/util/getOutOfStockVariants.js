/**
 * Find out of stock variants/options of current option selections
 * @return {Array} variants
 */
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { findAllMatchingVariants } from '@magento/peregrine/lib/util/findAllMatchingVariants';
import { getOutOfStockIndexes } from '@magento/peregrine/lib/util/getOutOfStockIndexes';
import { createProductVariants } from '@magento/peregrine/lib/util/createProductVariants';
import { getCombinations } from '@magento/peregrine/lib/util/getCombinations';

const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';

export const getOutOfStockVariants = (
    product,
    optionCodes,
    singleOptionSelection,
    optionSelections,
    isOutOfStockProductDisplayed
) => {
    const isConfigurable = isProductConfigurable(product);
    const outOfStockIndexes = [];

    if (isConfigurable) {
        let variants = product.variants;
        const variantsIfOutOfStockProductsNotDisplayed = createProductVariants(
            product
        );
        //If out of stock products is set to not displayed, use the variants created
        variants = isOutOfStockProductDisplayed
            ? variants
            : variantsIfOutOfStockProductsNotDisplayed;

        if (!variants || variants.length === 0) {
            return [];
        }

        if (!variants[0] || !variants[0].attributes) {
            return [];
        }

        const numberOfVariations = variants[0].attributes.length;

        // If only one pair of variations, display out of stock variations before option selection
        if (numberOfVariations === 1) {
            const outOfStockOptions = variants.filter(
                variant => variant.product.stock_status === OUT_OF_STOCK_CODE
            );

            const outOfStockIndex = outOfStockOptions.map(option =>
                option.attributes.map(attribute => attribute.value_index)
            );
            return outOfStockIndex;
        } else {
            const selectedIndexes = Array.from(
                optionSelections.values()
            ).filter(value => !!value);

            if (selectedIndexes.length > 0) {
                const items = findAllMatchingVariants({
                    optionCodes,
                    singleOptionSelection: optionSelections,
                    variants
                });
                const outOfStockItemsIndexes = getOutOfStockIndexes(items);

                // For all the out of stock options associated with current selection, display out of stock swatches
                // when the number of matching indexes of selected indexes and out of stock indexes are not smaller than the total groups of swatches minus 1
                for (const indexes of outOfStockItemsIndexes) {
                    const sameIndexes = indexes.filter(num =>
                        selectedIndexes.includes(num)
                    );
                    const differentIndexes = indexes.filter(
                        num => !selectedIndexes.includes(num)
                    );
                    if (sameIndexes.length > 0) {
                        outOfStockIndexes.push(differentIndexes);
                    }
                }
                // Display all possible out of stock swatches with current selections, when all groups of swatches are selected
                if (
                    selectedIndexes.length === optionCodes.size &&
                    !selectedIndexes.includes(undefined)
                ) {
                    const selectedIndexesCombinations = getCombinations(
                        selectedIndexes,
                        selectedIndexes.length - 1
                    );
                    // Find out of stock items and indexes for each combination
                    const oosIndexes = [];
                    for (const option of selectedIndexesCombinations) {
                        // Map the option indexes to their optionCodes
                        const curOption = new Map(
                            [...optionSelections].filter(
                                ([key, val]) => (
                                    option.includes(key), option.includes(val)
                                )
                            )
                        );
                        const curItems = findAllMatchingVariants({
                            optionCodes,
                            singleOptionSelection: curOption,
                            variants: variants
                        });
                        const outOfStockIndex = getOutOfStockIndexes(curItems)
                            ?.flat()
                            .filter(idx => !selectedIndexes.includes(idx));
                        oosIndexes.push(outOfStockIndex);
                    }
                    return oosIndexes;
                }
            } else {
                return [];
            }

            return outOfStockIndexes;
        }
    }
    return [];
};
