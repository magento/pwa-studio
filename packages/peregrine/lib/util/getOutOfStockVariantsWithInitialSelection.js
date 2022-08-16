/**
 * Find out of stock variants/options of current option selections with initial selctions
 * @return {Array} variants
 */
import { findAllMatchingVariants } from '@magento/peregrine/lib/util/findAllMatchingVariants';
import { getOutOfStockIndexes } from '@magento/peregrine/lib/util/getOutOfStockIndexes';
import { createProductVariants } from '@magento/peregrine/lib/util/createProductVariants';
import { getCombinations } from '@magento/peregrine/lib/util/getCombinations';

export const getOutOfStockVariantsWithInitialSelection = (
    product,
    configurableOptionCodes,
    multipleOptionSelections,
    configItem,
    isOutOfStockProductDisplayed
) => {
    if (configItem && product) {
        let variants = product.variants;
        const variantsIfOutOfStockProductsNotDisplayed = createProductVariants(
            configItem
        );
        //If out of stock products is set to not displayed, use the variants created
        variants = isOutOfStockProductDisplayed
            ? variants
            : variantsIfOutOfStockProductsNotDisplayed;
        if (
            multipleOptionSelections &&
            multipleOptionSelections.size === configurableOptionCodes.size
        ) {
            const selectedIndexes = Array.from(
                multipleOptionSelections.values()
            ).flat();

            const selectedIndexesCombinations = getCombinations(
                selectedIndexes,
                selectedIndexes.length - 1
            );
            const oosIndexes = [];
            for (const option of selectedIndexesCombinations) {
                const curOption = new Map(
                    [...multipleOptionSelections].filter(
                        ([key, val]) => (
                            option.includes(key), option.includes(val)
                        )
                    )
                );
                const curItems = findAllMatchingVariants({
                    optionCodes: configurableOptionCodes,
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
        return [];
    }
};
