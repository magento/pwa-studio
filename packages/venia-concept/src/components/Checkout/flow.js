import { Component, createElement } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import Cart from './cart';
import Form from './form';
import Receipt from './receipt';
import defaultClasses from './flow.css';

class Flow extends Component {
    static propTypes = {
        actions: shape({
            editOrder: func.isRequired,
            resetCheckout: func.isRequired,
            submitCart: func.isRequired,
            submitInput: func.isRequired,
            submitOrder: func.isRequired
        }).isRequired,
        checkout: shape({
            editing: string,
            step: string,
            submitting: bool,
            valid: bool
        }),
        classes: shape({
            root: string
        }),
        ready: bool
    };

    get child() {
        const { actions, checkout, ready } = this.props;
        const {
            editOrder,
            resetCheckout,
            submitCart,
            submitInput,
            submitOrder
        } = actions;
        const { editing, step, submitting, valid } = checkout;

        switch (step) {
            case 'cart': {
                const stepProps = { ready, submitCart, submitting };

                return <Cart {...stepProps} />;
            }
            case 'form': {
                const stepProps = {
                    editOrder,
                    editing,
                    submitInput,
                    submitOrder,
                    submitting,
                    valid
                };

                return <Form {...stepProps} />;
            }
            case 'receipt': {
                const stepProps = { resetCheckout };

                return <Receipt {...stepProps} />;
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
