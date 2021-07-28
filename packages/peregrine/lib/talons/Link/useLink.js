import { useEffect, useRef } from 'react';
import { useLazyQuery } from '@apollo/client';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';
import resourceUrl from '../../util/makeUrl';
import mergeOperations from '../../util/shallowMerge';
import DEFAULT_OPERATIONS from '../MagentoRoute/magentoRoute.gql';

const useLink = (shouldPrefetch, originalRef) => {
    const operations = shouldPrefetch ? mergeOperations(DEFAULT_OPERATIONS, props.operations) : {};

    const intersectionObserver = useIntersectionObserver();
    const { resolveUrlQuery } = operations;
    const elementRef = originalRef || !shouldPrefetch ? originalRef : useRef();
    const [
        runQuery,
        { called: pageTypeCalled }
    ] = shouldPrefetch ? useLazyQuery(resolveUrlQuery) : [null, {}];
    const linkPath = shouldPrefetch ? resourceUrl(props.to) : null;

    useEffect(() => {
        if (!shouldPrefetch || pageTypeCalled || !elementRef.current || typeof intersectionObserver === 'undefined') {
            return;
        }

        const onIntersection = (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                observer.unobserve(elementRef.current);

                runQuery({
                    variables: { url: linkPath }
                });
            }
        }
        const observer = new intersectionObserver(onIntersection);
        observer.observe(elementRef.current);

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [shouldPrefetch, elementRef, pageTypeCalled, linkPath, intersectionObserver]);

    return {
        ref: elementRef
    };
};

export default useLink;
