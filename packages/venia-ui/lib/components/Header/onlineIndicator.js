import React from 'react';
import { bool, shape, string } from 'prop-types';

import { CloudOff as CloudOffIcon } from 'react-feather';
import { mergeClasses } from '../../classify';

import Icon from '../Icon';
import defaultClasses from './onlineIndicator.css';

/**
 * Renders an online indicator when the app goes offline.
 */
const OnlineIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { hasBeenOffline, isOnline } = props;
    const iconClasses = { root: classes.root, icon: classes.icon };

    return hasBeenOffline && !isOnline ? (
        <Icon src={CloudOffIcon} classes={iconClasses} />
    ) : null;
};

OnlineIndicator.propTypes = {
    classes: shape({
        root: string,
        icon: string
    }),
    isOnline: bool,
    hasBeenOffline: bool
};

export default OnlineIndicator;
