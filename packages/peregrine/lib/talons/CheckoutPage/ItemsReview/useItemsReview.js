import { useEffect, useState, useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '../../../util/shallowMerge';
import DEFAULT_OPERATIONS from './itemsReview.gql';

export const useItemsReview = props => {
    const [showAllItems, setShowAllItems] = useState(false);
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getConfigurableThumbnailSource,
    } = operations;

    const { items: itemsData } = props;

    const { data: configurableThumbnailSourceData } = useQuery(
        getConfigurableThumbnailSource,
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    const configurableThumbnailSource = useMemo(() => {
        if (configurableThumbnailSourceData) {
            return configurableThumbnailSourceData.storeConfig
                .configurable_thumbnail_source;
        }
    }, [configurableThumbnailSourceData]);

    const setShowAllItemsFlag = useCallback(() => setShowAllItems(true), [
        setShowAllItems
    ]);

    useEffect(() => {
        /**
         * If there are 2 or less than 2 items in cart
         * set show all items to `true`.
         */
        if (itemsData && itemsData.length <= 2) {
            setShowAllItems(true);
        }
    }, [itemsData]);

    const items = itemsData || [];

    const totalQuantity = items
        ? items.reduce(
              (previousValue, currentValue) =>
                  previousValue + currentValue.quantity,
              0
          )
        : 0;

    return {
        items,
        totalQuantity,
        showAllItems,
        setShowAllItems: setShowAllItemsFlag,
        configurableThumbnailSource
    };
};
