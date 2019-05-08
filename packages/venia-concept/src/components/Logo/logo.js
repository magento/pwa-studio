import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { mergeClasses } from 'src/classify';
import logo from './logo.svg';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';

import CheckIcon from 'react-feather/dist/icons/check';
import AlertCircleIcon from 'react-feather/dist/icons/alert-circle';

const Logo = props => {
    const { height } = props;
    const classes = mergeClasses({}, props.classes);

    return (
        <img
            className={classes.logo}
            src={logo}
            height={height}
            alt="Venia"
            title="Venia"
        />
    );
};

Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number
};

Logo.defaultProps = {
    height: 24
};

export default Logo;
