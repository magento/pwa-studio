import { useEffect, useState, useCallback, useMemo } from 'react';
import { useLazyQuery } from '@apollo/client';

import { useCartContext } from '../../../context/cart';
import { useStoreConfigContext } from '../../../context/storeConfigProvider';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './itemsReview.gql';

export const useItemsReview = props => {
    const [showAllItems, setShowAllItems] = useState(false);
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getItemsInCartQuery } = operations;

    const [{ cartId }] = useCartContext();

    const storeConfigData = useStoreConfigContext();

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfigData]);

    const [fetchItemsInCart, { data: queryData, error, loading }] = useLazyQuery(getItemsInCartQuery, {
        fetchPolicy: 'cache-and-network'
    });

    // If static data was provided, use that instead of query data.
    const data = props.data || queryData;

    const setShowAllItemsFlag = useCallback(() => setShowAllItems(true), [setShowAllItems]);

    useEffect(() => {
        if (cartId && !props.data) {
            fetchItemsInCart({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchItemsInCart, props.data]);

    useEffect(() => {
        /**
         * If there are 2 or less than 2 items in cart
         * set show all items to `true`.
         */
        if (data && data.cart && data.cart.items.length <= 2) {
            setShowAllItems(true);
        }
    }, [data]);

    const items = data ? data.cart.items : [];

    const totalQuantity = data ? +data.cart.total_quantity : 0;

    return {
        isLoading: !!loading,
        items,
        hasErrors: !!error,
        totalQuantity,
        showAllItems,
        setShowAllItems: setShowAllItemsFlag,
        configurableThumbnailSource
    };
};
