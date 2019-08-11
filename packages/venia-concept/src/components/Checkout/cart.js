import React from 'react';
import { bool, func, shape, string } from 'prop-types';

import { mergeClasses } from '../../classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';

const Cart = props => {
    const { beginCheckout, ready, submitting } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const disabled = submitting || !ready;

    return (
        <div className={classes.root}>
            <CheckoutButton disabled={disabled} onClick={beginCheckout} />
        </div>
    );
};

Cart.propTypes = {
    beginCheckout: func.isRequired,
    classes: shape({
        root: string
    }),
    ready: bool.isRequired,
    submitting: bool.isRequired
};

export default Cart;
