import React, { useEffect } from 'react';
import { bool, shape, string } from 'prop-types';

import CloudOffIcon from 'react-feather/dist/icons/cloud-off';
import CheckIcon from 'react-feather/dist/icons/check';

import { mergeClasses } from 'src/classify';
import { useToastActions } from '@magento/peregrine/src/Toasts/useToastActions';
import Icon from 'src/components/Icon';
import defaultClasses from './onlineIndicator.css';

const OnlineIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const { addToast } = useToastActions();
    const { isOnline } = props;

    useEffect(() => {
        if (isOnline) {
            addToast({
                type: 'info',
                icon: CheckIcon,
                message: 'You are online.',
                timeout: 3000
            });
        } else {
            addToast({
                type: 'error',
                icon: CloudOffIcon,
                message: 'You are offline. Some features may be unavailable.'
            });
        }
    }, [isOnline]);

    return !isOnline ? (
        <Icon src={CloudOffIcon} className={classes.root} />
    ) : null;
};

OnlineIndicator.propTypes = {
    classes: shape({
        root: string
    }),
    isOnline: bool
};

export default OnlineIndicator;
