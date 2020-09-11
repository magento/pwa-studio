import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

const VENIA_SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];
const isSupportedProductType = product => {
    return VENIA_SUPPORTED_PRODUCT_TYPES.includes(product.__typename);
};

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

    const { error, loading, data } = useQuery(queries.getProductQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKey
        }
    });

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        const supportedProducts = data.products.items.filter(
            isSupportedProductType
        );
        // If a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.
        // Additionally, we may have an empty array after filtering out unsupported product types.
        if (!supportedProducts.length) {
            return null;
        }

        // Pick the first supported product.
        return mapProduct(supportedProducts[0]);
    }, [data, mapProduct]);

    return {
        error,
        loading,
        product
    };
};
