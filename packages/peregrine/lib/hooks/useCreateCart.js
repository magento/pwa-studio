import { useEffect, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCheckoutContext } from '@magento/peregrine/lib/context/checkout';

/**
 * A hook that ensures that there is always a valid cart id.
 *
 * @param {GraphQLQuery} props.createCartMutation a mutation for getting a cart id.
 */
export const useCreateCart = ({ createCartMutation }) => {
    const [{ cartId }, { getCartDetails, setCartId }] = useCartContext();
    const [, checkoutActions] = useCheckoutContext();
    const [isFetchingCartId, setIsFetchingCartId] = useState(false);
    const [createCart] = useMutation(createCartMutation);

    // On initial mount create a cart if there isn't a cartId in the store.
    useEffect(() => {
        async function initializeCart() {
            // First, reset checkout to clear any old state.
            checkoutActions.actions.reset();

            // Then fetch the cartId (existing or new) and store it.
            const {
                data: { createEmptyCart }
            } = await createCart();
            await setCartId(createEmptyCart);
            setIsFetchingCartId(false);
        }

        if (!cartId && !isFetchingCartId) {
            setIsFetchingCartId(true);
            initializeCart();
        }
    }, [
        cartId,
        checkoutActions,
        createCart,
        getCartDetails,
        isFetchingCartId,
        setCartId
    ]);
};
