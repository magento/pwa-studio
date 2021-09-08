import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { bool } from 'prop-types';
import useLink from '@magento/peregrine/lib/talons/Link/useLink';

const removeProps = (props, exclude) => {
    return Object.fromEntries(
        Object.entries(props).filter(([name]) => !exclude.includes(name))
    );
};

const Link = props => {
    const talonProps = useLink(props);
    const { ref } = talonProps;
    const propsForBase = removeProps(props, ['prefetchType', 'innerRef']);

    return <RouterLink {...propsForBase} innerRef={ref} />;
};

Link.defaultProps = {
    prefetchType: false
};

Link.propTypes = {
    prefetchType: bool
};

export default Link;
