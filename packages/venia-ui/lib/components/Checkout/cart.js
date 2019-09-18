import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';

const Cart = props => {
    const { beginCheckout, ready } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <CheckoutButton disabled={!ready} onClick={beginCheckout} />
        </div>
    );
};

Cart.propTypes = {
    beginCheckout: func.isRequired,
    classes: shape({
        root: string
    }),
    ready: bool.isRequired
};

export default Cart;
