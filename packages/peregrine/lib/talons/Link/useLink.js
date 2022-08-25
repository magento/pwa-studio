import { useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import resourceUrl from '../../util/makeUrl';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from '../MagentoRoute/magentoRoute.gql';

const useLink = (props, passedOperations = {}) => {
    const { innerRef: originalRef, to } = props;
    const shouldPrefetch = props.prefetchType || props.shouldPrefetch;
    const operations = shouldPrefetch
        ? mergeOperations(DEFAULT_OPERATIONS, passedOperations)
        : {};

    const intersectionObserver = useIntersectionObserver();
    const { resolveUrlQuery } = operations;
    const generatedRef = useRef();
    const elementRef =
        originalRef || !shouldPrefetch ? originalRef : generatedRef;
    const [runQuery, { called: pageTypeCalled }] = useLazyQuery(
        resolveUrlQuery
    );
    const linkPath = shouldPrefetch ? resourceUrl(to) : null;

    useEffect(() => {
        if (
            !shouldPrefetch ||
            pageTypeCalled ||
            !runQuery ||
            !elementRef.current ||
            !intersectionObserver
        ) {
            return;
        }

        const htmlElement = elementRef.current;

        const onIntersection = entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.unobserve(htmlElement);

                runQuery({
                    variables: { url: linkPath }
                });
            }
        };
        const observer = new intersectionObserver(onIntersection);
        observer.observe(htmlElement);

        return () => {
            if (htmlElement) {
                observer.unobserve(htmlElement);
            }
        };
    }, [
        shouldPrefetch,
        elementRef,
        pageTypeCalled,
        linkPath,
        intersectionObserver,
        runQuery
    ]);

    return {
        ref: elementRef
    };
};

export default useLink;
