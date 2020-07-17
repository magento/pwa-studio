import { useQuery } from '@apollo/client';

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
    const { mapProduct, queries, urlKey } = props;

    const { loading, error, data } = useQuery(queries.getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            onServer: false,
            urlKey
        }
    });

    return {
        error,
        loading,
        product: data ? mapProduct(data.productDetail.items[0]) : null
    };
};
