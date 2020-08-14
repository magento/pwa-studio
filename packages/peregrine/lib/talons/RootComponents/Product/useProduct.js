import { useApolloClient, useQuery } from '@apollo/client';
import { useMemo } from 'react';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {String}      props.cachePrefix - The prefix to apply to the cache key.
 * @param {GraphQLAST}  props.fragment - The GraphQL fragment to match against a cache entry.
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getProductFromCache - Fetches product data from cache.
 * @param {GraphQLAST}  props.queries.getProductFromNetwork - Fetches product using a server query
 * @param {String}      props.urlKey - The url_key of this product.
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct, typePolicies, queries, urlKey } = props;

    const apolloClient = useApolloClient();
    apolloClient.cache.policies.addTypePolicies(typePolicies);

    const {
        error: cacheError,
        loading: cacheLoading,
        data: cacheData
    } = useQuery(queries.getProductFromCache, {
        variables: {
            urlKey
        }
    });

    const {
        error: networkError,
        loading: networkLoading,
        data: networkData
    } = useQuery(queries.getProductFromNetwork, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKey
        }
    });

    const product = useMemo(() => {
        if (cacheData && cacheData.product) {
            return mapProduct(cacheData.product);
        }

        // If a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.
        if (networkData && networkData.products.items[0]) {
            const productFromNetwork = networkData.products.items[0];
            return mapProduct(productFromNetwork);
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return null;
    }, [cacheData, mapProduct, networkData]);

    return {
        error: networkError || cacheError,
        loading: cacheLoading || networkLoading,
        product
    };
};
