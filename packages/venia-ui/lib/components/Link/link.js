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
 * Use for links to pages within your app.
 *
 * @kind functional component
 * @param {props} props React component props
 * @returns {RouterLink} the `Link` component from `react-router-dom`. We add a `ref` to prefetch pages when the link enters the viewport.
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
