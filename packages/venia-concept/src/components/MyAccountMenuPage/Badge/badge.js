import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './badge.css';

class Badge extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            text: PropTypes.string
        }),
        children: PropTypes.node
    };

    render() {
        const { classes, children } = this.props;

        return (
            <span className={classes.root}>
                <span className={classes.text}>{children}</span>
            </span>
        );
    }
}

export default classify(defaultClasses)(Badge);
