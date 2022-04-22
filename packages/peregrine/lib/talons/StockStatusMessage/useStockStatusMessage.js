import { useMemo } from 'react';

import { OUT_OF_STOCK } from './constants';

export const useStockStatusMessage = props => {
    const { cartItems } = props;

    const hasOutOfStockItem = useMemo(() => {
        if (cartItems) {
            const isOutOfStock = cartItems.find(cartItem => {
                const { product } = cartItem;
                const { stock_status: stockStatus } = product;

                return stockStatus === OUT_OF_STOCK;
            });

            return !!isOutOfStock;
        }
    }, [cartItems]);

    return { hasOutOfStockItem };
};
