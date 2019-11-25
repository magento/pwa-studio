import { useEffect } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * A hook that ensures that there is always a valid cart id.
 *
 * @param {GraphQLQuery} props.createCartMutation a mutation for getting a cart id.
 */
export const useCreateCart = ({ createCartMutation }) => {
    const [{ cartId, isCreatingCart }, { createCart }] = useCartContext();
    const [fetchCartId] = useMutation(createCartMutation);

    // Create a cart if there isn't a cartId in the store.
    useEffect(() => {
        if (!cartId && !isCreatingCart) {
            createCart({
                fetchCartId
            });
        }
    }, [cartId, createCart, fetchCartId, isCreatingCart]);
};
