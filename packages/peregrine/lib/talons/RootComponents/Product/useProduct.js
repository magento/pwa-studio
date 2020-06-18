import { useMemo } from 'react';
import { useApolloClient, useQuery } from '@apollo/react-hooks';

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
 * @param {GraphQLAST}  props.query - The query to fetch a product.
 * @param {String}      props.urlKey - The url_key of this product.
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { cachePrefix, fragment, mapProduct, query, urlKey } = props;

    const apolloClient = useApolloClient();

    /*
     * Look up the product in cache first.
     *
     * We may have it from a previous query, but we have to manually tell Apollo cache where to find it.
     * A single product query (as described by https://github.com/magento/graphql-ce/issues/86)
     * will alleviate the need to do this manual work.
     *
     * If the object with the specified `id` is not in the cache, we get `null`.
     * If the object is in the cache but doesn't have all the fields we need, an error is thrown.
     *
     * @see https://www.apollographql.com/docs/react/caching/cache-interaction/#readfragment.
     */
    const productFromCache = useMemo(() => {
        try {
            return apolloClient.readFragment({
                id: `${cachePrefix}:${urlKey}`,
                fragment,
                variables: { onServer: false }
            });
        } catch (e) {
            // The product is in the cache but it is missing some fields the fragment needs.
            return null;
        }
    }, [apolloClient, cachePrefix, fragment, urlKey]);

    /*
     * Fetch the product from the network.
     *
     * Note that this always fires, regardless of whether we have a cached product or not:
     * If we do not have a cached product, we need to go fetch it from the network.
     * If we do have a cached product, we want to ensure its cache entry doesn't get stale.
     * In both cases, Apollo will update the cache with the latest data when this returns.
     */
    const { loading, error, data } = useQuery(query, {
        // Once we're able to remove the manual cache lookup,
        // this fetch policy can change to 'cache-and-network'.
        fetchPolicy: 'network-only',
        variables: {
            onServer: false,
            urlKey
        }
    });

    const product = useMemo(() => {
        if (productFromCache) {
            return mapProduct(productFromCache);
        }

        // If a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.
        if (data && data.productDetail.items[0]) {
            const productFromNetwork = data.productDetail.items[0];
            return mapProduct(productFromNetwork);
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return null;
    }, [data, mapProduct, productFromCache]);

    return {
        error,
        loading,
        product
    };
};
