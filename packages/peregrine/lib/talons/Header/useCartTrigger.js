import { useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory } from 'react-router-dom';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

/**
 * Routes to hide the mini cart on.
 */
const DENIED_MINI_CART_ROUTES = ['/checkout'];

/**
 *
 * @param {DocumentNode} props.queries.getItemCountQuery query to get the total cart items count
 *
 * @returns {
 *      itemCount: Number,
 *      miniCartIsOpen: Boolean,
 *      handleLinkClick: Function,
 *      handleTriggerClick: Function,
 *      miniCartRef: Function,
 *      hideCartTrigger: Function,
 *      setMiniCartIsOpen: Function
 *  }
 */
export const useCartTrigger = props => {
    const {
        queries: { getItemCountQuery }
    } = props;

    const [{ cartId }] = useCartContext();
    const {
        elementRef: miniCartRef,
        expanded: miniCartIsOpen,
        setExpanded: setMiniCartIsOpen
    } = useDropdown();
    const history = useHistory();

    const { data } = useQuery(getItemCountQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            cartId
        },
        skip: !cartId
    });
    const itemCount = data ? data.cart.total_quantity : 0;
    const hideCartTrigger = DENIED_MINI_CART_ROUTES.includes(
        history.location.pathname
    );

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
        miniCartRef,
        hideCartTrigger,
        setMiniCartIsOpen
    };
};
