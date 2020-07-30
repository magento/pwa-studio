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
                        // If we get a cache-hit, the benefit of the prefetch
                        // is achieved already, so no need to hit network.
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
                // `isIntersecting` will be true if 50% of the referenced node
                // is visible.
                threshold: 0.5
            }),
        [handleScrollIntoView]
    );

    useEffect(() => {
        // On mount, begin observing the gallery item for interesection.
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
