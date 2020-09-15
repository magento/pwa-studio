import { useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';
import { useAppContext } from '@magento/peregrine/lib/context/app';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getProductQuery - Fetches product using a server query
 * @param {String}      props.urlKey - The url_key of this product.
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct, queries, urlKey } = props;
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const { error, loading, data } = useQuery(queries.getProductQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKey
        }
    });

    const isBackgroundLoading = !!data && loading;

    const product = useMemo(() => {
        // If a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.
        if (data && data.products.items[0]) {
            return mapProduct(data.products.items[0]);
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return null;
    }, [data, mapProduct]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        error,
        loading,
        product
    };
};
