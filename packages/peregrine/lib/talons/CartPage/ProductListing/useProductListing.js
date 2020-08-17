import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import { useCartContext } from '../../../context/cart';

/**
 * This talon contains logic for a Product Listing component.
 * It performs effects and returns prop data to render the component on a cart page.
 * 
 * @function
 * 
 * @param {Object} props 
 * @param {ProductListingQueries} queries GraphQL queries for Product Listing
 * 
 * @returns {ProductListingProps}
 */
export const useProductListing = props => {
    const {
        /**
         * GraphQL queries for Product Listing
         * 
         * @typedef {Object} ProductListingQueries
         * 
         * @property {GraphQLAST} getProductListing Query to get the product list for a cart
         * 
         * @see [productListingFragments.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListingFragments.js}
         * for the queries used in Venia
         */
        queries: { getProductListing }
    } = props;

    const [{ cartId }] = useCartContext();
    const [activeEditItem, setActiveEditItem] = useState(null);

    const [
        fetchProductListing,
        { called, data, error, loading }
    ] = useLazyQuery(getProductListing);

    useEffect(() => {
        if (cartId) {
            fetchProductListing({
                variables: {
                    cartId
                }
            });
        }
    }, [cartId, fetchProductListing]);

    useEffect(() => {
        if (error) {
            console.error(error);
        }
    }, [error]);

    let items = [];
    if (called && !error && !loading) {
        items = data.cart.items;
    }

    /**
     * Props data for a Product Listing component.
     * 
     * @typedef {Object} ProductListingProps
     * 
     * @property {Object} activeEditItem The product item currently being edited
     * @property {boolean} isLoading True if the query to get the product listing is still in progress. False otherwise.
     * @property {Array<Object>} items A list of products in a cart
     * @property {function} setActiveEditItem Function for setting the current item to edit
     * 
     */
    return {
        activeEditItem,
        isLoading: !!loading,
        items,
        setActiveEditItem
    };
};
