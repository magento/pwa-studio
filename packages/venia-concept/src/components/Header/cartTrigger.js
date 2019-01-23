import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { toggleCart } from 'src/actions/cart';
import classify from 'src/classify';
import defaultClasses from './cartTrigger.css';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        toggleCart: PropTypes.func.isRequired
    };

    render() {
        const { children, classes, toggleCart } = this.props;

        return (
            <button
                className={classes.root}
                aria-label="Toggle mini cart"
                onClick={toggleCart}
            >
                {children}
            </button>
        );
    }
}

const mapDispatchToProps = {
    toggleCart
};

export default compose(
    classify(defaultClasses),
    connect(
        null,
        mapDispatchToProps
    )
)(Trigger);
