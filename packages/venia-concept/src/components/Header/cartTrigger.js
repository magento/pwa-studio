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


    /**
     * Get items quantity from cart state
     * This is total number of items in cart 
     * (e.g. 1 x item A + 2 x item B = 3).
     * Which is not the same as items count 
     * (total number of different products).
     * 
     * @returns number || null
     */
    get itemsQuantity() {
        const { cart } = this.props;
        const itemQty = cart.details.items_qty;
        return itemQty > 0 ? itemQty : null;
    }

    render() {
        const { children, classes, toggleCart } = this.props;
        const { itemsQuantity } = this;

        return (
            <button
                className={classes.root}
                aria-label="Toggle mini cart"
                onClick={toggleCart}
            >
                {children}
                <span className={classes.counter}>{itemsQuantity}</span>
            </button>
        );
    }
}

const mapDispatchToProps = {
    toggleCart
};

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart
    };
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Trigger);
