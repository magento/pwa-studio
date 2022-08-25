import React from 'react';

import defaultClasses from './indicator.module.css';
import { useStyle } from '../../classify';
import { Loader as LoaderIcon } from 'react-feather';
import Icon from '../Icon';

const LoadingIndicator = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const className = props.global ? classes.global : classes.root;

    return (
        <div className={className}>
            <Icon
                src={LoaderIcon}
                size={64}
                classes={{ icon: classes.indicator }}
            />
            <span className={classes.message}>{props.children}</span>
        </div>
    );
};

export default LoadingIndicator;
