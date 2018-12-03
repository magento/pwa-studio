import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './actionButton.css';

class ActionButton extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            button: PropTypes.string
        })
    };

    render() {
        const { children, classes, ...props } = this.props;

        return (
            <button {...props} type="button" className={classes.button}>
                {children}
            </button>
        );
    }
}

export default classify(defaultClasses)(ActionButton);
