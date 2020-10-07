import { useCallback, useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';

/**
 * @function
 *
 * @param {Object} props
 * @param {Array<Object>} props.items Collection of items in Order
 * @param {OrderRowQueries} props.queries GraphQL queries for the Order Row Component
 *
 * @returns {OrderRowTalonProps}
 */
export const useOrderRow = props => {
    const { items, queries } = props;
    const { getProductThumbnailsQuery } = queries;

    const skus = useMemo(() => {
        return items.map(item => item.product_sku).sort();
    }, [items]);

    const { data, loading } = useQuery(getProductThumbnailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            skus
        }
    });
    const imagesData = useMemo(() => {
        if (data) {
            return data.products.items;
        } else {
            return [];
        }
    }, [data]);

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
 * GraphQL queries for the Order Row Component
 *
 * @typedef {Object} OrderRowQueries
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
