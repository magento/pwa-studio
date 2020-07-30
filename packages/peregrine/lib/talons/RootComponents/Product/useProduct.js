import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries - Queries for this component
 * @param {String}      props.urlKey - The url_key of this product.
 *
 * @returns {object}    result
 * @returns {object}    result.error - Indicates a network error occurred.
 * @returns {boolean}   result.loading - Indicates the query is in flight.
 * @returns {object}     result.product - The product's details.
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

    const product = useMemo(() => {
        // If a product is out of stock _and_ the backend specifies not to
        // display OOS items, the items array will be empty.
        if (data && data.productDetail.items[0]) {
            const productFromNetwork = data.productDetail.items[0];
            return mapProduct(productFromNetwork);
        }

        // The product isn't in the cache and we don't have a response from GraphQL yet.
        return null;
    }, [data, mapProduct]);

    return {
        error,
        loading,
        product
    };
};
