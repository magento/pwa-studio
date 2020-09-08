import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

/**
 * @function
 *
 * @param {Object} props
 * @param {Number} props.imageCount Count for how many images to fetch
 * @param {Array<Object>} props.items Collection of items in Order
 * @param {CollapsedImageGalleryQueries} props.queries GraphQL queries for Collapsed Image Gallery
 *
 * @returns {CollapsedImageGalleryTalonProps}
 */
export const useCollapsedImageGallery = props => {
    const { imageCount, items, queries } = props;
    const { getProductThumbnailsQuery } = queries;

    const skus = useMemo(() => {
        return items.map(item => item.product_sku);
    }, [items]);

    const { data } = useQuery(getProductThumbnailsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            imageCount,
            skus
        }
    });

    return {
        imageData: data
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL queries for Collapsed Image Gallery
 *
 * @typedef {Object} CollapsedImageGalleryQueries
 *
 * @property {GraphQLAST} getProductThumbnailsQuery The query used to get product thumbnails for up to the first four items in the Order.
 *
 * @see [`collapsedImageGallery.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/OrderHistoryPage/collapsedImageGallery.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering a collapsed image gallery
 *
 * @typedef {Object} CollapsedImageGalleryTalonProps
 *
 * @property {Object} imageData Data response from calling getProductThumbnailsQuery
 */
