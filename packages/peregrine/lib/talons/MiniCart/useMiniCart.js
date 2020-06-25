import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useMiniCart = props => {
    const { setIsOpen, queries, mutations } = props;
    const { shoppingBagQuery } = queries;
    const { removeItemMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();

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

    const subTotal = useMemo(() => {
        if (!shoppingBagLoading && shoppingBagData) {
            return shoppingBagData.cart.prices.subtotal_excluding_tax;
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

    const handleProceedToCheckout = useCallback(() => {
        history.push('/checkout');
        setIsOpen(false);
    }, [history, setIsOpen]);

    const handleEditCart = useCallback(() => {
        history.push('/cart');
        setIsOpen(false);
    }, [history, setIsOpen]);

    const handleContinueShopping = useCallback(() => {
        history.push('/');
        setIsOpen(false);
    }, [history, setIsOpen]);

    return {
        loading: shoppingBagLoading || (removeItemCalled && removeItemLoading),
        totalQuantity,
        subTotal,
        productListings,
        error: shoppingBagError,
        handleRemoveItem,
        handleEditCart,
        handleProceedToCheckout,
        handleContinueShopping
    };
};
