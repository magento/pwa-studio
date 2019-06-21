import React from 'react';

import defaultClasses from './indicator.css';
import { mergeClasses } from 'src/classify';

import logo from '../Logo/logo.svg';

// The <img> tag below has a hardcoded className, because it is
// sharing its animation styles with the spinner code inlined
// into the app shell. See templates/critical-style.mst.
const LoadingIndicator = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    // `global` renders a fixed-position full-page indicator.
    const className = props.global ? classes.global : classes.root;

    return (
        <div className={className}>
            <img
                className="i-c-spin"
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
