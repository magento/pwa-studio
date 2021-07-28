import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { bool } from 'prop-types';
import useLink from '@magento/peregrine/lib/talons/Link/useLink';

const Link = (props) => {
    const { prefetchType, innerRef, ...remainingProps } = props;
    const talonProps = useLink(prefetchType, innerRef);
    const {
        ref
    } = talonProps;

    return (
        <RouterLink {...remainingProps} innerRef={ref} />
    );
};

Link.defaultProps = {
    prefetchType: false
};

Link.propTypes = {
    prefetchType: bool
};

export default Link;
