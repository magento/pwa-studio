import React, { Component } from 'react';
import PropTypes from 'prop-types';
import defaultClasses from './errorDisplay.css';
import classify from 'src/classify';

class ErrorDisplay extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        error: PropTypes.object
    };

    render() {
        const { classes, error } = this.props;
        if (error) {
            const isErrorEmpty = Object.keys(error).length === 0;
            return !isErrorEmpty ? (
                <div className={classes.root}>
                    <p> {`Error: ${error.message.substring(0, 100)}...`} </p>
                </div>
            ) : null;
        } else {
            return null;
        }
    }
}

export default classify(defaultClasses)(ErrorDisplay);
