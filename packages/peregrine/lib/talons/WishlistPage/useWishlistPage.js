import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './wishlistPage.gql';

/**
 * @function
 *
 * @returns {WishlistPageProps}
 */
export const useWishlistPage = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);
    const { getCustomerWishlistQuery } = operations;

    const [{ isSignedIn }] = useUserContext();

    const { data, error, loading } = useQuery(getCustomerWishlistQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const derivedWishlists = useMemo(() => {
        return (data && data.customer.wishlists) || [];
    }, [data]);

    const errors = useMemo(() => {
        return new Map([['getCustomerWishlistQuery', error]]);
    }, [error]);

    return {
        errors,
        loading,
        shouldRenderVisibilityToggle: derivedWishlists.length > 1,
        wishlists: derivedWishlists
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL mutations for the Wishlist Page
 *
 * @typedef {Object} WishlistQueries
 *
 * @property {GraphQLDocument} getCustomerWishlistQuery Query to get customer wish lists
 *
 * @see [`wishlistPage.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistPage.gql.js}
 * for queries used in Venia
 */

/**
 * GraphQL types for the Wishlist Page
 *
 * @typedef {Object} WishlistTypes
 *
 * @property {Function} Customer.fields.wishlists.read
 *
 * @see [`wishlistPage.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistPageProps
 *
 * @property {Map} errors A map of all the GQL query errors
 * @property {Boolean} loading is the query loading
 * @property {Boolean} shouldRenderVisibilityToggle true if wishlists length is > 1.
 * @property {Object} wishlists List of all customer wishlists
 */
