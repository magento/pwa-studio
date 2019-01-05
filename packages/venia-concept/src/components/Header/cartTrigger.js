import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import { toggleCart } from 'src/actions/cart';
import CartCounter from './cartCounter';

import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './cartTrigger.css';

class Trigger extends Component {
    static propTypes = {
        children: PropTypes.node,
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        toggleCart: PropTypes.func.isRequired,
        itemsQty: PropTypes.number
    };

    render() {
        const { classes, toggleCart, cart } = this.props;
        const itemsQty = cart.details.items_qty;
        const iconColor = 'rgb(var(--venia-text))';

        return (
            <button className={classes.root} onClick={toggleCart}>
                <Icon
                    name="shopping-cart"
                    attrs={{ stroke: iconColor, fill: iconColor }}
                />
                <CartCounter counter={itemsQty ? itemsQty : 0} />
            </button>
        );
    }
}

const mapStateToProps = state => {
    const { cart } = state;

    return {
        cart
    };
};

const mapDispatchToProps = {
    toggleCart
};

export default compose(
    classify(defaultClasses),
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Trigger);
