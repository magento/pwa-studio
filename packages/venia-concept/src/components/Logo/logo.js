import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { mergeClasses } from 'src/classify';
import logo from './logo.svg';

import SmileIcon from 'react-feather/dist/icons/smile';
import { useToasts } from '@magento/peregrine';

const Logo = props => {
    const { height } = props;
    const classes = mergeClasses({}, props.classes);

    const [, { addToast }] = useToasts();
    const toastProps = {
        type: 'info',
        message: `I'll be a duplicate toast`,
        icon: SmileIcon,
        dismissable: true,
        timeout: 10000
    };

    const errorToastProps = {
        ...toastProps,
        type: 'error',
        message:
            'Negative message with an action link to perform a repeat request',
        onAction: () => {
            console.log("I'm an error!");
        },
        actionText: 'Action link'
    };

    useEffect(() => {
        setTimeout(() => {
            addToast(toastProps);
        }, 100);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            addToast(errorToastProps);
        }, 2000);
    }, []);

    useEffect(() => {
        setTimeout(() => {
            addToast(toastProps);
        }, 3000);
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
