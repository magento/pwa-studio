import { useCallback, useEffect } from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

export const useCartTrigger = props => {
    const {
        mutations: { createCartMutation },
        queries: { getCartDetailsQuery, getItemCountQuery }
    } = props;

    const apolloClient = useApolloClient();
    const [{ cartId }, { getCartDetails }] = useCartContext();
    const {
        elementRef: miniCartRef,
        expanded: miniCartIsOpen,
        setExpanded: setMiniCartIsOpen
    } = useDropdown();
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

    const itemCount = data ? data.cart.total_quantity : 0;

    useEffect(() => {
        // Passing apolloClient to wipe the store in event of auth token expiry
        // This will only happen if the user refreshes.
        getCartDetails({ apolloClient, fetchCartId, fetchCartDetails });
    }, [apolloClient, fetchCartDetails, fetchCartId, getCartDetails]);

    const handleTriggerClick = useCallback(() => {
        // Open the mini cart.
        setMiniCartIsOpen(true);
    }, [setMiniCartIsOpen]);

    const handleLinkClick = useCallback(() => {
        // Send the user to the cart page.
        history.push('/cart');
    }, [history]);

    return {
        handleLinkClick,
        handleTriggerClick,
        itemCount,
        miniCartIsOpen,
        miniCartRef
    };
};
