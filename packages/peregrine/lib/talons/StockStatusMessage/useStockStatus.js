import { useMemo } from 'react';

import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { IN_STOCK, LOW_STOCK, OUT_OF_STOCK } from './constants';

export const useStockStatus = props => {
    const { item } = props;

    const stockStatus = useMemo(() => {
        if (item.stock_status === OUT_OF_STOCK) {
            return item.stock_status;
        }

        if (isProductConfigurable(item)) {
            const someProductAreLowStock = item.variants.some(({ product }) => {
                return (
                    product.stock_status === OUT_OF_STOCK ||
                    product.only_x_left_in_stock > 0
                );
            });

            return someProductAreLowStock ? LOW_STOCK : IN_STOCK;
        }

        return item.only_x_left_in_stock > 0 ? LOW_STOCK : IN_STOCK;
    }, [item]);

    return { stockStatus };
};
