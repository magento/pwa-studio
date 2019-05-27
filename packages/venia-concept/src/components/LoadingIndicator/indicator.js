import React, { Component } from 'react';

import classify from 'src/classify';
import defaultClasses from './indicator.css';

import logo from '../Logo/logo.svg';

// The <img> tag below has a hardcoded className, because it is
// sharing its animation styles with the spinner code inlined
// into the app shell. See templates/critical-style.mst.
class LoadingIndicator extends Component {
    render() {
        const { props } = this;
        const { children, classes } = props;

        return (
            <div className={classes.root}>
                <img
                    className="i-c-spin"
                    src={logo}
                    width="64"
                    height="64"
                    alt="Loading indicator"
                />
                <span className={classes.message}>{children}</span>
            </div>
        );
    }
}

export default classify(defaultClasses)(LoadingIndicator);
