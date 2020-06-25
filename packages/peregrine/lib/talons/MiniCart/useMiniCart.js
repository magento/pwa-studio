import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useMiniCart = props => {
    const { queries, mutations } = props;
    const { shoppingBagQuery } = queries;
    const { removeItemMutation } = mutations;

    const [{ cartId }] = useCartContext();

    const {
        data: shoppingBagData,
        loading: shoppingBagLoading,
        error: shoppingBagError
    } = useQuery(shoppingBagQuery, {
        fetchPolicy: 'cache-and-network',
        variables: { cartId },
        skip: !cartId
    });

    const [
        removeItem,
        { loading: removeItemLoading, called: removeItemCalled }
    ] = useMutation(removeItemMutation);

    const totalQuantity = useMemo(() => {
        if (!shoppingBagLoading && shoppingBagData) {
            return shoppingBagData.cart.total_quantity;
        }
    }, [shoppingBagData, shoppingBagLoading]);

    const productListings = useMemo(() => {
        if (!shoppingBagLoading && shoppingBagData) {
            return shoppingBagData.cart.items;
        }
    }, [shoppingBagData, shoppingBagLoading]);

    const handleRemoveItem = useCallback(
        async id => {
            try {
                const { error } = await removeItem({
                    variables: {
                        cartId,
                        itemId: id
                    }
                });

                if (error) {
                    throw error;
                }
            } catch (err) {
                console.error('Cart Item Removal Error', err);
            }
        },
        [cartId, removeItem]
    );

    return {
        loading: shoppingBagLoading || (removeItemCalled && removeItemLoading),
        totalQuantity,
        productListings,
        error: shoppingBagError,
        handleRemoveItem
    };
};
