import React, { Component } from 'react';
import Icon from 'src/components/Icon';
import CloudOffIcon from 'react-feather/dist/icons/cloud-off';
import CheckIcon from 'react-feather/dist/icons/check';
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

        return !isOnline ? (
            <div className={classes.offline}>
                <Icon src={CloudOffIcon} />
                <p> You are offline. Some features may be unavailable. </p>
            </div>
        ) : (
            <div className={classes.online}>
                <Icon src={CheckIcon} />
                <p> You are online. </p>
            </div>
        );
    }
}

export default classify(defaultClasses)(OnlineIndicator);
