import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * This talon contains logic for a cart page component.
 * It performs effects and returns prop data for rendering the component.
 *
 * This talon performs the following effects:
 *
 * - Manages the updating state of the cart while cart details data is being fetched
 *
 * @function
 *
 * @param {Object} props
 * @param {CartPageQueries} props.queries GraphQL queries
 *
 * @returns {CartPageTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';
 */
export const useCartPage = props => {
    const {
        queries: { getCartDetails }
    } = props;

    const [{ cartId }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const { called, data, loading } = useQuery(getCartDetails, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: { cartId }
    });

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);

    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    const cartItems = useMemo(() => {
        return (data && data.cart.items) || [];
    }, [data]);

    return {
        cartItems,
        hasItems,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator
    };
};

/** JSDoc type definitions */

/**
 * GraphQL formatted string queries used in this talon.
 *
 * @typedef {Object} CartPageQueries
 *
 * @property {GraphQLAST} getCartDetails Query for getting the cart details.
 *
 * @see [cartPage.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a cart page component.
 *
 * @typedef {Object} CartPageTalonProps
 *
 * @property {Array<Object>} cartItems An array of item objects in the cart.
 * @property {boolean} hasItems True if the cart has items. False otherwise.
 * @property {boolean} isCartUpdating True if the cart is updating. False otherwise.
 * @property {function} setIsCartUpdating Callback function for setting the updating state of the cart page.
 * @property {boolean} shouldShowLoadingIndicator True if the loading indicator should be rendered. False otherwise.
 */
