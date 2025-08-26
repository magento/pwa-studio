/**
 * Find out of stock variants/options of current option selections with initial selctions
 * @return {Array} variants
 */
import { findAllMatchingVariants } from '@magento/peregrine/lib/util/findAllMatchingVariants';
import { getOutOfStockIndexes } from '@magento/peregrine/lib/util/getOutOfStockIndexes';
import { createProductVariants } from '@magento/peregrine/lib/util/createProductVariants';
import { getCombinations } from '@magento/peregrine/lib/util/getCombinations';

const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';

export const getOutOfStockVariantsWithInitialSelection = (
    product,
    configurableOptionCodes,
    multipleOptionSelections,
    configItem,
    isOutOfStockProductDisplayed
) => {
    if (configItem) {
        const selectedIndexes = Array.from(
            multipleOptionSelections.values()
        ).filter(value => !!value);

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

        if (numberOfVariations === 1) {
            const outOfStockOptions = variants.filter(
                variant => variant.product.stock_status === OUT_OF_STOCK_CODE
            );

            const outOfStockIndex = outOfStockOptions.map(option =>
                option.attributes.map(attribute => attribute.value_index)
            );
            return outOfStockIndex;
        } else {
            const outOfStockIndexes = [];

            if (selectedIndexes.length > 0) {
                const items = findAllMatchingVariants({
                    optionCodes: configurableOptionCodes,
                    singleOptionSelection: multipleOptionSelections,
                    variants
                });

                const outOfStockItemsIndexes = getOutOfStockIndexes(items);

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

                if (
                    selectedIndexes.length === configurableOptionCodes.size &&
                    !selectedIndexes.includes(undefined)
                ) {
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
            } else {
                return [];
            }

            return outOfStockIndexes;
        }
    }
    return [];
};
