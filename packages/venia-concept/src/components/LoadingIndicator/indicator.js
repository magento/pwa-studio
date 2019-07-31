import React from 'react';

import defaultClasses from './indicator.css';
import { mergeClasses } from '../../classify';

import logo from '../Logo/logo.svg';

const LoadingIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const className = props.global ? classes.global : classes.root;

    return (
        <div className={className}>
            <img
                className={classes.indicator}
                src={logo}
                width="64"
                height="64"
                alt="Loading indicator"
            />
            <span className={classes.message}>{props.children}</span>
        </div>
    );
};

export default LoadingIndicator;
