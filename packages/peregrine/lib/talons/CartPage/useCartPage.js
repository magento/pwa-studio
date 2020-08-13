import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * Provides the logic used for rendering a cart page.
 * 
 * @function
 * 
 * @param {Object} props 
 * @param {CartPageQueries} props.queries Queries to get data
 * 
 * @returns {CartPageProps} Data used when rendering the Cart Page.
 */
export const useCartPage = props => {
    const {
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
        queries: { getCartDetails }
    } = props;

    const [, { toggleDrawer }] = useAppContext();
    const [{ isSignedIn }] = useUserContext();
    const [{ cartId }] = useCartContext();

    const [isCartUpdating, setIsCartUpdating] = useState(false);

    const { called, data, loading } = useQuery(getCartDetails, {
        fetchPolicy: 'cache-and-network',
        // Don't make this call if we don't have a cartId
        skip: !cartId,
        variables: { cartId }
    });

    const handleSignIn = useCallback(() => {
        // TODO: set navigation state to "SIGN_IN". useNavigation:showSignIn doesn't work.
        toggleDrawer('nav');
    }, [toggleDrawer]);

    useEffect(() => {
        // Let the cart page know it is updating while we're waiting on network data.
        setIsCartUpdating(loading);
    }, [loading]);

    const hasItems = !!(data && data.cart.total_quantity);
    const shouldShowLoadingIndicator = called && loading && !hasItems;

    /**
     * Data used when rendering the Cart Page.
     * 
     * @typedef {Object} CartPageProps
     * 
     * @property {Boolean} hasItems True if the cart has items. False otherwise.
     * @property {Function} handleSignIn Callback function to call during a sign in event.
     * @property {Boolean} isSignedIn True if the current user is signed in. False otherwise.
     * @property {Boolean} isCartUpdating True if the cart is updating. False otherwise.
     * @property {Function} setIsCartUpdating Callback function for setting the updating state of the cart page.
     * @property {Boolean} shouldShowLoadingIndicator True if the loading indicator should be rendered. False otherwise.
     */
    return {
        hasItems,
        handleSignIn,
        isSignedIn,
        isCartUpdating,
        setIsCartUpdating,
        shouldShowLoadingIndicator
    };
};
