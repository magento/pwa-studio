import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { mergeClasses } from 'src/classify';
import logo from './logo.svg';

import SmileIcon from 'react-feather/dist/icons/smile';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';

const Logo = props => {
    const { height } = props;
    const classes = mergeClasses({}, props.classes);

    const { addToast } = useToastActions();

    // TODO REMOVE THESE DEMO TOASTS
    useEffect(() => {
        const toastProps = {
            type: 'info',
            message: `I'm a duplicate toast`,
            icon: SmileIcon,
            dismissable: true,
            timeout: 7000
        };
        setTimeout(() => {
            addToast(toastProps);
        }, 100);
        setTimeout(() => {
            addToast(toastProps);
        }, 6000);
    }, []);

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
