import React from 'react';
import { bool, shape, string } from 'prop-types';

import { CloudOff as CloudOffIcon } from 'react-feather';
import { useStyle } from '../../classify';

import Icon from '../Icon';
import defaultClasses from './onlineIndicator.module.css';

/**
 * Renders an online indicator when the app goes offline.
 */
const OnlineIndicator = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { hasBeenOffline, isOnline } = props;

    return hasBeenOffline && !isOnline ? (
        <Icon src={CloudOffIcon} className={classes.root} />
    ) : null;
};

OnlineIndicator.propTypes = {
    classes: shape({
        root: string
    }),
    isOnline: bool,
    hasBeenOffline: bool
};

export default OnlineIndicator;
