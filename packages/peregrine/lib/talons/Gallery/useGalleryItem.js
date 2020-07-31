import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

/**
 *
 * @param {Object}  props
 * @param {Object}  props.item - the product item being rendered
 * @param {Object}  props.queries - the queries for the gallery item
 * @param {Boolean} props.shouldPrefetchProduct - whether or not to prefetch the
 * corresponding product.
 *
 * @returns {{
 *  ref: the ref for the gallery item, used by the intersection observer
 * }}
 */
export const useGalleryItem = props => {
    const { item, queries, shouldPrefetchProduct } = props;

    const { prefetchProductQuery } = queries;
    const { url_key } = item;

    // Prefetch the underlying product for this gallery item, but only if we
    // don't have any product data yet, and only once the gallery item is in
    // view.
    const [runPrefetchQuery] = useLazyQuery(prefetchProductQuery);
    const [hasPrefetched, setHasPrefetched] = useState(false);
    const galleryItemRef = useRef();

    const handleScrollIntoView = useCallback(
        entries => {
            entries.forEach(entry => {
                if (
                    shouldPrefetchProduct &&
                    entry.isIntersecting &&
                    !hasPrefetched
                ) {
                    setHasPrefetched(true);
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
        [hasPrefetched, runPrefetchQuery, shouldPrefetchProduct, url_key]
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
