import React, { Component } from 'react';
import Icon from 'src/components/Icon';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './onlineIndicator.css';

class OnlineIndicator extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        isOnline: PropTypes.bool
    };

    render() {
        const { isOnline, classes } = this.props;

        return (!isOnline
            ? <div className={classes.root}>
                <Icon name="cloud-off" />
               <p> You are offline. Some features may be unavailable. </p>
            </div>
            : null)
    }
}

export default classify(defaultClasses)(OnlineIndicator);
