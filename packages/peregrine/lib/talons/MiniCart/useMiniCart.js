import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { useCartContext } from '../../context/cart';

export const useMiniCart = props => {
    const { queries, mutations } = props;
    const { miniCartQuery } = queries;
    const { removeItemMutation } = mutations;

    const [{ cartId }] = useCartContext();

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
        productList,
        errors,
        handleRemoveItem
    };
};
