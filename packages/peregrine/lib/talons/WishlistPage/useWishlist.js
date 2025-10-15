import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import mergeOperations from '../../util/shallowMerge';
import defaultOperations from './wishlist.gql';

/**
 * @function
 * @param {String} props.wishlistId The ID of the wishlist this item belongs to
 * @para  {itemsCount} props.itemsCount The items count fo the list.
 * @param {Boolean} props.isCollapsed state of is visable
 * @returns {WishListProps}
 */
export const useWishlist = (props = {}) => {
    const { id, itemsCount, isCollapsed } = props;
    const operations = mergeOperations(defaultOperations, props.operations);

    const [page, setPage] = useState(1);
    const [isOpen, setIsOpen] = useState(!isCollapsed);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const hasFetchedRef = useRef(false);

    const [fetchWishlistItems, queryResult] = useLazyQuery(
        operations.getCustomerWishlistItems,
        {
            fetchPolicy: 'cache-first',
            nextFetchPolicy: 'cache-first',
            variables: {
                id,
                currentPage: 1,
                pageSize: 20
            }
        }
    );
    const { data, error, loading, fetchMore } = queryResult;

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    const handleLoadMore = useCallback(async () => {
        setIsFetchingMore(true);
        const currentPage = page + 1;

        try {
            await fetchMore({
                variables: {
                    id,
                    currentPage,
                    pageSize: 20
                },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return prevResult;
                    }

                    const prevWishlist = prevResult.customer.wishlist_v2;
                    const newWishlist = fetchMoreResult.customer.wishlist_v2;

                    if (prevWishlist.id !== newWishlist.id) {
                        return prevResult;
                    }

                    const prevItems = prevWishlist.items_v2.items || [];
                    const newItems = newWishlist.items_v2.items || [];

                    const existingIds = new Set(prevItems.map(item => item.id));
                    const uniqueNewItems = newItems.filter(
                        item => !existingIds.has(item.id)
                    );

                    return {
                        ...prevResult,
                        customer: {
                            ...prevResult.customer,
                            wishlist_v2: {
                                ...prevWishlist,
                                items_v2: {
                                    ...prevWishlist.items_v2,
                                    items: [...prevItems, ...uniqueNewItems]
                                }
                            }
                        }
                    };
                }
            });

            setPage(currentPage);
        } catch (error) {
            console.error('Error loading more wishlist items:', error);
        } finally {
            setIsFetchingMore(false);
        }
    }, [id, fetchMore, page]);

    useEffect(() => {
        if (itemsCount >= 1 && isOpen === true && !hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchWishlistItems();
        }
    }, [itemsCount, isOpen, fetchWishlistItems]);

    const items = useMemo(() => {
        if (!data || !data.customer || !data.customer.wishlist_v2) {
            return [];
        }

        const allItems = data.customer.wishlist_v2.items_v2?.items || [];

        const uniqueItems = [];
        const seenIds = new Set();

        for (const item of allItems) {
            if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                uniqueItems.push(item);
            }
        }

        return uniqueItems;
    }, [data]);

    return {
        handleContentToggle,
        isOpen,
        items,
        error,
        isLoading: !!loading,
        isFetchingMore,
        handleLoadMore
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
 * @property {Boolean} isFetchingMore Boolean which represents if is in loading more state
 * @property {Function} handleLoadMore Callback to load more items
 */
