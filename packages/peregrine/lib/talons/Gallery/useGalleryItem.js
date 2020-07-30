import { useCallback, useEffect, useRef, useMemo } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

/**
 *
 * @param {Object} props
 * @param {Object} props.item - the product item being rendered
 * @param {Object} props.queries - the queries for the gallery item
 *
 * @returns {undefined} This talon returns nothing as the data the GalleryItem
 * component needs is passed by a parent and all this does is prefetch product
 * data.
 */
export const useGalleryItem = props => {
    const { item, queries } = props;

    const { prefetchProductQuery } = queries;
    const { url_key } = item;

    // Prefetch the underlying product for this gallery item, but only if we
    // don't have any product data yet, and only once the gallery item is in
    // view.
    const [runPrefetchQuery] = useLazyQuery(prefetchProductQuery);
    const galleryItemRef = useRef();

    const handleScrollIntoView = useCallback(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runPrefetchQuery({
                        variables: {
                            urlKey: url_key,
                            onServer: false
                        },
                        fetchPolicy: 'cache-first'
                    });
                }
            });
        },
        [runPrefetchQuery, url_key]
    );

    const observer = useMemo(
        () =>
            new IntersectionObserver(handleScrollIntoView, {
                threshold: 0,
                root: null
            }),
        [handleScrollIntoView]
    );

    useEffect(() => {
        if (galleryItemRef.current) {
            observer.observe(galleryItemRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [observer]);

    return {
        ref: galleryItemRef
    };
};
