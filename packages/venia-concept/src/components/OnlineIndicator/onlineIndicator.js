import React from 'react';
import { bool, shape, string } from 'prop-types';

import CloudOffIcon from 'react-feather/dist/icons/cloud-off';
import { mergeClasses } from 'src/classify';

import Icon from 'src/components/Icon';
import defaultClasses from './onlineIndicator.css';

/**
 * Renders an online indicator when the app goes offline.
 */
const OnlineIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
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
