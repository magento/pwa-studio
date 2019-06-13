import React, { Component } from 'react';
import { bool, func, shape, string } from 'prop-types';

import classify from 'src/classify';
import CheckoutButton from './checkoutButton';
import defaultClasses from './cart.css';

class Cart extends Component {
    static propTypes = {
        beginCheckout: func.isRequired,
        classes: shape({
            root: string
        }),
        ready: bool.isRequired,
        submitting: bool.isRequired
    };

    render() {
        const { beginCheckout, classes, ready, submitting } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.footer}>
                    <CheckoutButton
                        ready={ready}
                        submitting={submitting}
                        submit={beginCheckout}
                    />
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Cart);
