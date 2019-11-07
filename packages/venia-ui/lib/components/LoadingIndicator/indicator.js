import React from 'react';

import defaultClasses from './indicator.css';
import { mergeClasses } from '../../classify';
import Image from '../Image';

import logo from '../Logo/logo.svg';

const LoadingIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const className = props.global ? classes.global : classes.root;

    return (
        <div className={className}>
            <Image
                alt="Loading indicator"
                classes={{ image: classes.indicator }}
                displayPlaceholder={false}
                height="64"
                src={logo}
                width="64"
            />
            <span className={classes.message}>{props.children}</span>
        </div>
    );
};

export default LoadingIndicator;
