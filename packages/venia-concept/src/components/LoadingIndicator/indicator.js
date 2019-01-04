import React, { Component } from 'react';

import classify from 'src/classify';
import defaultClasses from './indicator.css';
// TODO: move to a common location
import logo from '../Header/logo.svg';

class LoadingIndicator extends Component {
    render() {
        const { props } = this;
        const { children, classes } = props;

        return (
            <div className={classes.root}>
                <img
                    className={classes.indicator}
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
