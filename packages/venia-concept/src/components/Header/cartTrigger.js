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
        toggleCart: PropTypes.func.isRequired
    };

    get cartIcon() {
        const { cart } = this.props;
        const itemsQty = cart.details.items_qty;
        const svgAttributes = {
            stroke: 'rgb(var(--venia-text))',
        };
    
        if (itemsQty > 0) {
            svgAttributes.fill = 'rgb(var(--venia-text))';
        }
    
        return (
            <Icon
                name="shopping-cart"
                attrs={svgAttributes}
            />
        );
    }

    render() {
        const { classes, toggleCart, cart } = this.props;
        const itemsQty = cart.details.items_qty;

        return (
            <button
                className={classes.root}
                aria-label="Toggle mini cart"
                onClick={toggleCart}
            >
                {this.cartIcon}
                <CartCounter counter={itemsQty ? itemsQty : 0} />
            </button>
        );
    }
}

const mapStateToProps = state => {
    const { cart } = state;
    
    return {
        cart
    }
}

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
