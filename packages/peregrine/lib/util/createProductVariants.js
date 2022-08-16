/**
 * Rebuild the array of variants with out of stock items data added.
 * Since when admin selects in the Admin dashboard to not to display out of stock products
 * the variants data that are needed to find disabled swatches only show the the in stock ones, missing the out of stock ones
 * We rebuild the variants here to display all the variants and mark the stock status accordingly
 * This returns an array of objects
 */

export const createProductVariants = product => {
    const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';
    const IN_STOCK_CODE = 'IN_STOCK';

    if (product && product.configurable_options) {
        const { variants } = product;
        // Compute the permutation of all possible arrays of given arrays
        // For example, if array = [[1,2],[10,20],[100,200,300]]
        // the result is [[1, 10, 100], [1, 10, 200], [1, 10, 300], [1, 20, 100], [1, 20, 200],
        // [1, 20, 300], [2, 10, 100], [2, 10, 200], [2, 10, 300], [2, 20, 100], [2, 20, 200], [2, 20, 300]]
        const cartesian = (...array) =>
            array.reduce((array, current) =>
                array.flatMap(cur => current.map(n => [cur, n].flat()))
            );

        const configurableOptionsValueIndexes = product.configurable_options.map(
            option => option.values.map(value => value.value_index)
        );
        // Get all possible variants for current options
        const allPossibleItems = cartesian(...configurableOptionsValueIndexes);

        const variantsValueIndexes = variants.map(variant =>
            variant.attributes.map(attribute => attribute.value_index)
        );

        const newVariantsArray = [];
        const len = allPossibleItems.length;
        let foundMatch;
        let currentValueIndex = [];
        for (let i = 0; i < len; i++) {
            currentValueIndex = allPossibleItems[i];
            for (const option of variantsValueIndexes) {
                // If found the same item option in the current variants array, meaning the item is in stock
                // If not found a match, meaning the item is out of stock, which is why it's not in the current variants array
                // with the not to display out of stock products selected in Admin dashboard
                foundMatch =
                    option.length > 1
                        ? Array.from(currentValueIndex)
                              .sort()
                              .toString() === option.sort().toString()
                        : currentValueIndex.toString() === option.toString();
                if (foundMatch) {
                    break;
                }
            }

            const newAttributes = [];
            // If there are more than 1 group of swatches
            if (currentValueIndex.length && currentValueIndex.length > 1) {
                for (const index of Array.from(currentValueIndex)) {
                    const code = product.configurable_options.find(option =>
                        option.values.find(value => value.value_index === index)
                    );
                    newAttributes.push({
                        value_index: index,
                        code: code.attribute_code
                    });
                }
                // If there's only one group of swatches
            } else {
                const code = product.configurable_options.find(option =>
                    option.values.find(
                        value => value.value_index === currentValueIndex
                    )
                );
                newAttributes.push({
                    value_index: currentValueIndex,
                    code: code.attribute_code
                });
            }
            newVariantsArray.push({
                key: i,
                attributes: Array.from(newAttributes),
                product: {
                    stock_status: foundMatch ? IN_STOCK_CODE : OUT_OF_STOCK_CODE
                }
            });
        }
        return newVariantsArray;
    } else {
        return [];
    }
};
