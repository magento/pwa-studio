import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { toggleCart } from 'src/actions/cart';
import classify from 'src/classify';
import defaultClasses from './cartTrigger.css';

// named export for testing purposes
export class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        toggleCart: PropTypes.func.isRequired,
        //.isRequired fails at first render because 
        // itemsQuantity undefined ...
        itemsQty: PropTypes.number
    };

    /**
     * - Cart counter only shows when items have
     *   been added to cart.
     * - Counter shows total number of items in cart 
     *   e.g. 1 x item A + 2 x item B = 3 .
     * 
     * @returns { (number|null) }
     */
    get cartCounter() {
        const counter = this.props.itemsQty || 0;
        const  { classes } = this.props;
        return counter && counter > 0 ? (
            <span className={classes.counter}>{counter}</span> 
        ) : null;
    }

    render() {
        const { children, classes, toggleCart } = this.props;
        const { cartCounter } = this;

        return (
            <button
                className={classes.root}
                aria-label="Toggle mini cart"
                onClick={toggleCart}
            >
                {children}
                {cartCounter}
            </button>
        );
    }
}

const mapDispatchToProps = {
    toggleCart
};

/**
 * Get items quantity from cart state
 * 
 * @param state
 * @returns { number } 
 */
const mapStateToProps = state => {
    const itemsQty = state.cart.details.items_qty;

    return {
        itemsQty
    };
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Trigger);
