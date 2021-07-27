import React, { useRef, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { bool } from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/MagentoRoute/magentoRoute.gql';

const Link = (props) => {
    const { prefetchType, innerRef, ...remainingProps } = props;
    const operations = prefetchType ? mergeOperations(DEFAULT_OPERATIONS, props.operations) : {};

    const { resolveUrlQuery } = operations;
    const elementRef = innerRef || !prefetchType ? innerRef : useRef();
    const [
        runQuery,
        { called: pageTypeCalled }
    ] = prefetchType ? useLazyQuery(resolveUrlQuery) : [null, {}];
    const linkPath = prefetchType ? resourceUrl(props.to) : null;

    useEffect(() => {
        if (!prefetchType || pageTypeCalled || !elementRef.current || typeof IntersectionObserver === 'undefined') {
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
        const observer = new IntersectionObserver(onIntersection);
        observer.observe(elementRef.current);

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [prefetchType, elementRef, pageTypeCalled, linkPath]);

    return (
        <RouterLink {...remainingProps} innerRef={elementRef} />
    );
};

Link.defaultProps = {
    prefetchType: false
};

Link.propTypes = {
    prefetchType: bool
};

export default Link;
