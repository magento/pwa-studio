import { useCallback, useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './orderRow.gql';

/**
 * @function
 *
 * @param {Object} props
 * @param {Array<Object>} props.items Collection of items in Order
 * @param {OrderRowOperations} props.operations GraphQL queries for the Order Row Component
 *
 * @returns {OrderRowTalonProps}
 */
export const useOrderRow = props => {
    const { items } = props;
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getProductThumbnailsQuery } = operations;

    const urlKeys = useMemo(() => {
        return items.map(item => item.product_url_key).sort();
    }, [items]);

    const { data, loading } = useQuery(getProductThumbnailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            urlKeys
        }
    });
    const imagesData = useMemo(() => {
        if (data) {
            // filter out items returned that we didn't query for
            const filteredItems = data.products.items.filter(item =>
                urlKeys.includes(item.url_key)
            );
            return filteredItems;
        } else {
            return [];
        }
    }, [data, urlKeys]);

    const [isOpen, setIsOpen] = useState(false);

    const handleContentToggle = useCallback(() => {
        setIsOpen(currentValue => !currentValue);
    }, []);

    return {
        loading,
        imagesData,
        isOpen,
        handleContentToggle
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Order Row Component
 *
 * @typedef {Object} OrderRowOperations
 *
 * @property {GraphQLAST} getProductThumbnailsQuery The query used to get product thumbnails of items in the Order.
 *
 * @see [`orderRow.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/OrderHistoryPage/orderRow.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a collapsed image gallery
 *
 * @typedef {Object} OrderRowTalonProps
 *
 * @property {Object} imagesData Images data with thumbnail URLs to render.
 * @property {Boolean} isOpen Boolean which represents if a row is open or not
 * @property {Function} handleContentToggle Callback to toggle isOpen value
 */
