import { useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { useUserContext } from '../../context/user';
import { useTypePolicies } from '../../hooks/useTypePolicies';

/**
 * @function
 *
 * @param {WishlistQueries} props.queries Wishlist Page queries
 * @param {WishlistTypes} props.types Wishlist Page GQL types
 *
 * @returns {WishlistPageProps}
 */
export const useWishlistPage = props => {
    const { queries, types } = props;
    const { getCustomerWishlistQuery } = queries;

    useTypePolicies(types);

    const history = useHistory();
    const [{ isSignedIn }] = useUserContext();

    const { data, error } = useQuery(getCustomerWishlistQuery, {
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

    useEffect(() => {
        if (!isSignedIn) {
            history.push('/');
        }
    }, [history, isSignedIn]);

    return {
        errors,
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
 * @property {GraphQLAST} getCustomerWishlistQuery Query to get customer wish lists
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
 * @property {Object} wishlists List of all customer wishlists
 */
