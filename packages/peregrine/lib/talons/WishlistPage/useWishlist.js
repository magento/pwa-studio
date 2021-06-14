import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';

import { useUserContext } from '../../context/user';
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
    console.log(props);


    const { id, itemsCount, collapsed } = props;
    const [{ isSignedIn }] = useUserContext();
    const operations = mergeOperations(defaultOperations, props.operations, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(collapsed);

    const [fetchWhislistItems, queryResult] = useLazyQuery(
        operations.getCustomerWhislistItems
    );
    const { data, error, loading } = queryResult;

    const handleContentToggle = () => {
        setIsOpen(currentValue => !currentValue);
    };

    useEffect(() => {
        if (data && data.customer.wishlist_v2.items_v2.items) {
            setItems(data.customer.wishlist_v2.items_v2.items);
        }
    }, [data]);

    useEffect(() => {
        console.log(itemsCount + ' ' + isOpen);

        if (itemsCount >= 1 && isOpen === true) {
            console.log('fetch');
            fetchWhislistItems({
                variables: {
                    id
                }
            });
        }
    }, [id, itemsCount, isOpen, fetchWhislistItems]);

    return {
        handleContentToggle,
        isOpen,
        items,
        error,
        loading
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
 */
