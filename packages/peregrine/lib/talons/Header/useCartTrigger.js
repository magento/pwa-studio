import { useCallback, useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router-dom';

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
    const history = useHistory();
    const location = useLocation();
    const [isHidden, setIsHidden] = useState(() =>
        DENIED_MINI_CART_ROUTES.includes(location.pathname)
    );

    const {
        elementRef: miniCartRef,
        expanded: miniCartIsOpen,
        setExpanded: setMiniCartIsOpen,
        triggerRef: miniCartTriggerRef
    } = useDropdown();

    const { data } = useQuery(getItemCountQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            cartId
        },
        skip: !cartId,
        errorPolicy: 'all'
    });

    const itemCount = data?.cart?.total_quantity || 0;

    const handleTriggerClick = useCallback(() => {
        // Open the mini cart.
        setMiniCartIsOpen(isOpen => !isOpen);
    }, [setMiniCartIsOpen]);

    const handleLinkClick = useCallback(() => {
        // Send the user to the cart page.
        history.push('/cart');
    }, [history]);

    useEffect(() => {
        setIsHidden(DENIED_MINI_CART_ROUTES.includes(location.pathname));
    }, [location]);

    return {
        handleLinkClick,
        handleTriggerClick,
        itemCount,
        miniCartIsOpen,
        miniCartRef,
        hideCartTrigger: isHidden,
        setMiniCartIsOpen,
        miniCartTriggerRef
    };
};
