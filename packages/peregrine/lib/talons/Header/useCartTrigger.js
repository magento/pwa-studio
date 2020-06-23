import { useCallback, useEffect, useState } from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';

export const useCartTrigger = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCartDetailsQuery, getItemCountQuery }
    } = props;

    const apolloClient = useApolloClient();
    const [, { toggleDrawer }] = useAppContext();
    const [{ cartId }, { getCartDetails }] = useCartContext();
    const history = useHistory();

    const { data } = useQuery(getItemCountQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            cartId
        },
        skip: !cartId
    });

    const [fetchCartId] = useMutation(createCartMutation);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const [shoppingBagIsOpen, setShoppingBagIsOpen] = useState(false);

    const itemCount = data ? data.cart.total_quantity : 0;

    useEffect(() => {
        // Passing apolloClient to wipe the store in event of auth token expiry
        // This will only happen if the user refreshes.
        getCartDetails({ apolloClient, fetchCartId, fetchCartDetails });
    }, [apolloClient, fetchCartDetails, fetchCartId, getCartDetails]);

    /**
     * @deprecated
     * handleClick supports the old MiniCart.
     * Toggle the APP_USE_SHOPPING_BAG environment variable in your
     * .env file to upgrade to the new ShoppingBag experience.
     */
    const handleClick = useCallback(async () => {
        toggleDrawer('cart');
        // TODO: Cart details should be fetched by MiniCart.
        await getCartDetails({
            fetchCartId,
            fetchCartDetails
        });
    }, [fetchCartDetails, fetchCartId, getCartDetails, toggleDrawer]);

    const handleDesktopClick = useCallback(async () => {
        // On desktop, toggle the shopping bag.
        setShoppingBagIsOpen(isOpen => !isOpen);
    }, [setShoppingBagIsOpen]);

    const handleMobileClick = useCallback(() => {
        // On mobile, send the user to the cart page.
        history.push('/cart');
    }, [history]);

    return {
        handleClick,
        handleDesktopClick,
        handleMobileClick,
        itemCount,
        shoppingBagIsOpen,
        setShoppingBagIsOpen
    };
};
