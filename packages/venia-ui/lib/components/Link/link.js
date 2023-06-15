import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { bool } from 'prop-types';
import { useLink } from '@magento/peregrine/lib/talons/Link/useLink';

/**
 * @kind functional component
 *
 * @property {bool} shouldPrefetch `true` activates prefetching the target page when the link becomes visible in the viewport.
 * @property {string} to From [react-router-dom Link](https://knowbody.github.io/react-router-docs/api/Link.html). The absolute path to the target page of the link. Uses the `to` prop from the `react-router-dom Link`.
 *
 * @example <caption>Basic usage</caption>
 * <Link shouldPrefetch={true} to="/about/">About Us</Link>
 */
const Link = props => {
    // TODO: remove `prefetchType`
    const { innerRef, prefetchType, shouldPrefetch, ...propsForBase } = props;
    const talonProps = useLink({
        ...props,
        innerRef,
        shouldPrefetch: shouldPrefetch || prefetchType
    });
    const { ref } = talonProps;

    return <RouterLink {...propsForBase} innerRef={ref} />;
};

Link.defaultProps = {
    prefetchType: false,
    shouldPrefetch: false
};

/**
 * @property {bool} [prefetchType=false] Deprecated. Use `shouldPrefetch` instead.
 * @property {bool} [shouldPrefetch=false] Determine if the link should be prefetched using `IntersectionObserver`.
 */
Link.propTypes = {
    prefetchType: bool,
    shouldPrefetch: bool
};

export default Link;
