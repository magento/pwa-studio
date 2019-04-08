import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './trigger.css';

class Trigger extends Component {
    static propTypes = {
        action: PropTypes.func.isRequired,
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        })
    };

    render() {
        const { action, children, classes } = this.props;

        return (
            <button className={classes.root} type="button" onClick={action}>
                {children}
            </button>
        );
    }
}

export default classify(defaultClasses)(Trigger);
