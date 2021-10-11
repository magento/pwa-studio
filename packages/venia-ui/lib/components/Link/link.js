import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { bool } from 'prop-types';
import useLink from '@magento/peregrine/lib/talons/Link/useLink';

const removeProps = (props, exclude) => {
    return Object.fromEntries(
        Object.entries(props).filter(([name]) => !exclude.includes(name))
    );
};

/**
 * @kind functional component
 *
 * @property {bool} prefetchType `true` activates prefetching the target page when the link becomes visible in the viewport.
 * @property {string} to From [react-router-dom Link](https://knowbody.github.io/react-router-docs/api/Link.html). The absolute path to the target page of the link. Uses the `to` prop from the `react-router-dom Link`.
 *
 * @example <caption>Basic usage</caption>
 * <Link prefetchType={true} to="/about/">About Us</Link>
 */
const Link = props => {
    const talonProps = useLink(props);
    const { ref } = talonProps;
    const propsForBase = removeProps(props, ['prefetchType', 'innerRef']);

    return <RouterLink {...propsForBase} innerRef={ref} />;
};

Link.defaultProps = {
    prefetchType: false
};

/**
 * @property {bool} [prefetchType=false] Determine if the link should be prefetched using `IntersectionObserver`.
 */
Link.propTypes = {
    prefetchType: bool
};

export default Link;
