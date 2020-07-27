import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

/**
 *
 * @param {Object} props
 * @param {Object} props.item - the product item being rendered
 * @param {Object} props.queries - the queries for the gallery item
 */
export const useGalleryItem = props => {
    const { item, queries } = props;

    const { prefetchProductQuery } = queries;
    const { url_key } = item;

    // Prefetch the underlying product for this gallery item.
    const [runPrefetchQuery] = useLazyQuery(prefetchProductQuery);
    useEffect(() => {
        if (item) {
            runPrefetchQuery({
                variables: {
                    urlKey: url_key,
                    onServer: false
                }
            });
        }
    }, [item, runPrefetchQuery, url_key]);
};
