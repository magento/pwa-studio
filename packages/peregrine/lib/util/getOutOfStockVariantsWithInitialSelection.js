/**
 * Find out of stock variants/options of current option selections with initial selctions
 * @return {Array} variants
 */
import { createProductVariants } from '@magento/peregrine/lib/util/createProductVariants';
import { getUnavailableConfigurableValues } from '@magento/peregrine/lib/util/getUnavailableConfigurableValues';

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
        }

        if (selectedIndexes.length === 0) {
            return [];
        }

        const unavailable = getUnavailableConfigurableValues(
            product,
            configurableOptionCodes,
            multipleOptionSelections,
            variants
        );

        return unavailable.length ? [unavailable] : [];
    }
    return [];
};
