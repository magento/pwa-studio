import React, { Component } from 'react';
import { bool, func, object, shape, string } from 'prop-types';

import classify from 'src/classify';
import Cart from './cart';
import Form from './form';
import Receipt from './Receipt';
import defaultClasses from './flow.css';

const stepMap = {
    cart: 1,
    form: 2,
    receipt: 3
};

const isCartReady = items => items > 0;
const isAddressValid = address => !!(address && address.email);

class Flow extends Component {
    static propTypes = {
        actions: shape({
            beginCheckout: func.isRequired,
            editOrder: func.isRequired,
            resetCheckout: func.isRequired,
            submitInput: func.isRequired,
            submitOrder: func.isRequired
        }).isRequired,
        cart: shape({
            details: object,
            guestCartId: string,
            totals: object
        }),
        checkout: shape({
            editing: string,
            step: string,
            submitting: bool
        }),
        classes: shape({
            root: string
        })
    };

    get child() {
        const { actions, cart, checkout } = this.props;
        const { beginCheckout, editOrder, submitInput, submitOrder } = actions;
        const { editing, step, submitting } = checkout;
        const { details } = cart;
        const ready = isCartReady(details.items_count);
        const valid = isAddressValid(details.billing_address);

        switch (stepMap[step]) {
            case 1: {
                const stepProps = { beginCheckout, ready, submitting };

                return <Cart {...stepProps} />;
            }
            case 2: {
                const stepProps = {
                    cart,
                    editOrder,
                    editing,
                    submitInput,
                    submitOrder,
                    submitting,
                    valid
                };

                return <Form {...stepProps} />;
            }
            case 3: {
                return <Receipt />;
            }
            default: {
                return null;
            }
        }
    }

    render() {
        const { child, props } = this;
        const { classes } = props;

        return <div className={classes.root}>{child}</div>;
    }
}

export default classify(defaultClasses)(Flow);
