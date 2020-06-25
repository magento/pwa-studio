import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useMiniCart = props => {
    const { queries, mutations } = props;
    const { shoppingBagQuery } = queries;
    const { removeItemMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();

    const {
        data: shoppingBadData,
        loading: shoppingBadLoading,
        error: shoppingBadError
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
        if (!shoppingBadLoading && shoppingBadData) {
            return shoppingBadData.cart.total_quantity;
        }
    }, [shoppingBadData, shoppingBadLoading]);

    const subTotal = useMemo(() => {
        if (!shoppingBadLoading && shoppingBadData) {
            return shoppingBadData.cart.prices.subtotal_excluding_tax;
        }
    }, [shoppingBadData, shoppingBadLoading]);

    const productListings = useMemo(() => {
        if (!shoppingBadLoading && shoppingBadData) {
            return shoppingBadData.cart.items;
        }
    }, [shoppingBadData, shoppingBadLoading]);

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

    const handleProceedToCheckout = useCallback(() => {
        history.push('/checkout');
    }, [history]);

    const handleEditCart = useCallback(() => {
        history.push('/cart');
    }, [history]);

    return {
        loading: shoppingBadLoading || (removeItemCalled && removeItemLoading),
        totalQuantity,
        subTotal,
        productListings,
        error: shoppingBadError,
        handleRemoveItem,
        handleEditCart,
        handleProceedToCheckout
    };
};
