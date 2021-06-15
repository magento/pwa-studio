import { useCallback, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './wishlist.gql';

/**
 * @function
 * @param {String} props.wishlistId The ID of the wishlist this item belongs to
 * @para  {itemsCount} props.itemsCount The items count fo the list.
 * @param {Boolean} props.collapsed state of is visable
 * @returns {WishListProps}
 */
export const useWishlist = (props = {}) => {
    const { id, itemsCount, collapsed } = props;
    const operations = mergeOperations(defaultOperations, props.operations);

    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(collapsed);
    const [isFetchMore, setIsFetchMore] = useState(false);

    const [fetchWhislistItems, queryResult] = useLazyQuery(
        operations.getCustomerWhislistItems,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                id
            }
        }
    );
    const { data, error, loading, fetchMore } = queryResult;

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    const onLoadMore = useCallback(
        async function() {
            setIsFetchMore(true);
            const currentPage = page + 1;
            const fetchMoreData = await fetchMore({
                variables: {
                    currentPage
                }
            });

            setPage(currentPage);

            if (
                fetchMoreData &&
                fetchMoreData.data.customer.wishlist_v2.items_v2.items
            ) {
                setItems(
                    items.concat(
                        fetchMoreData.data.customer.wishlist_v2.items_v2.items
                    )
                );
            }

            setIsFetchMore(false);
        },
        [fetchMore, items, page]
    );

    useEffect(() => {
        if (data && data.customer.wishlist_v2.items_v2.items) {
            setItems(data.customer.wishlist_v2.items_v2.items);
        }
    }, [data, fetchMore]);

    useEffect(() => {
        if (itemsCount >= 1 && isOpen === true && items.length === 0) {
            fetchWhislistItems();
        }
    }, [id, itemsCount, isOpen, fetchWhislistItems, items]);

    return {
        handleContentToggle,
        isOpen,
        items,
        error,
        isLoading: !!loading,
        isFetchMore,
        onLoadMore
    };
};

/**
 * JSDoc type definitions
 */

/**
 * Props data to use when rendering the Wishlist component.
 *
 * @typedef {Object} WishListProps
 *
 * @property {Function} handleContentToggle Callback to handle list expand toggle
 * @property {Boolean} isOpen Boolean which represents if the content is expanded or not
 * @property {Array} items list of items
 * @property {Boolean} isLoading Boolean which represents if is in loading state
 */
