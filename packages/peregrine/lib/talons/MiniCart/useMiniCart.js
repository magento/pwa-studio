import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

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

    const handleRemoveItem = useCallback(
        async id => {
            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: id
                    }
                });
            } catch (err) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('Cart Item Removal Error', err);
                }
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

    const errors = useMemo(() => {
        const errors = [];
        const errorTargets = [removeItemError, miniCartError];

        errorTargets.forEach(errorTarget => {
            if (errorTarget && errorTarget.graphQLErrors) {
                errorTarget.graphQLErrors.forEach(({ message }) => {
                    errors.push(message);
                });
            }
        });

        return errors;
    }, [removeItemError, miniCartError]);

    return {
        loading: miniCartLoading || (removeItemCalled && removeItemLoading),
        totalQuantity,
        subTotal,
        productList,
        errors,
        handleRemoveItem,
        handleEditCart,
        handleProceedToCheckout
    };
};
