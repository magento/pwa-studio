import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';
import { deriveErrorMessage } from '../../util/deriveErrorMessage';

/**
 *
 * @param {DocumentNode} props.queries.miniCartQuery - Query to fetch mini cart data
 * @param {DocumentNode} props.mutations.removeItemMutation - Mutation to remove an item from cart
 *
 * @returns {
 *      loading: Boolean,
 *      totalQuantity: Number
 *      productList: Array<>
 *      errors: Array<String>
 *      handleRemoveItem: Function
 *  }
 */
export const useMiniCart = props => {
    const { setIsOpen, queries, mutations } = props;
    const { miniCartQuery } = queries;
    const { removeItemMutation } = mutations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();

    const {
        data: miniCartData,
        loading: miniCartLoading,
        error: miniCartError
    } = useQuery(miniCartQuery, {
        fetchPolicy: 'cache-and-network',
        variables: { cartId },
        skip: !cartId
    });

    const [
        removeItem,
        {
            loading: removeItemLoading,
            called: removeItemCalled,
            error: removeItemError
        }
    ] = useMutation(removeItemMutation);

    const totalQuantity = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.total_quantity;
        }
    }, [miniCartData, miniCartLoading]);

    const subTotal = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.prices.subtotal_excluding_tax;
        }
    }, [miniCartData, miniCartLoading]);

    const productList = useMemo(() => {
        if (!miniCartLoading && miniCartData) {
            return miniCartData.cart.items;
        }
    }, [miniCartData, miniCartLoading]);

    const closeMiniCart = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const handleRemoveItem = useCallback(
        async id => {
            await removeItem({
                variables: {
                    cartId,
                    itemId: id
                }
            });
        },
        [cartId, removeItem]
    );

    const handleProceedToCheckout = useCallback(() => {
        setIsOpen(false);
        history.push('/checkout');
    }, [history, setIsOpen]);

    const handleEditCart = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const errors = useMemo(
        () => deriveErrorMessage([removeItemError, miniCartError]),
        [miniCartError, removeItemError]
    );

    return {
        loading: miniCartLoading || (removeItemCalled && removeItemLoading),
        totalQuantity,
        subTotal,
        productList,
        errors,
        handleRemoveItem,
        handleEditCart,
        handleProceedToCheckout,
        closeMiniCart
    };
};
