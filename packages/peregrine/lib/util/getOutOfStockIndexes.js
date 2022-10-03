/**
 * Find the value_index of out of stock variants
 * @return {Array} indexes
 */

export const getOutOfStockIndexes = items => {
    const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';
    return items
        ?.filter(item => item.product.stock_status === OUT_OF_STOCK_CODE)
        .map(option =>
            option.attributes.map(attribute => attribute.value_index)
        );
};
