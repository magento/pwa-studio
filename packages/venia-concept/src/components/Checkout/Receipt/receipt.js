import React, { Component } from 'react';
import { func, shape, string, number } from 'prop-types';

import classify from 'src/classify';
import Button, { darkThemeClasses } from 'src/components/Button';
import defaultClasses from './receipt.css';

class Receipt extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        resetCheckout: func.isRequired,
        orderId: number
    };

    static defaultProps = {
        //TODO: implement fetching of orderId
        orderId: 777
    };

    render() {
        const { classes, resetCheckout, orderId } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <h2 className={classes.header}>
                        Thank you for your purchase!
                    </h2>
                    <div className={classes.textBlock}>
                        Your order # is{' '}
                        <span className={classes.orderId}>{orderId}</span>
                        <br />
                        We'll email you an order confirmation with details and
                        tracking info
                    </div>
                    <Button classes={darkThemeClasses} onClick={resetCheckout}>
                        Continue Shopping
                    </Button>
                    <div className={classes.textBlock}>
                        Track order status and earn rewards for your purchase by
                        creating and account.
                    </div>
                    <Button classes={darkThemeClasses}>
                        Create an Account
                    </Button>
                </div>
            </div>
        );
    }
}

export default classify(defaultClasses)(Receipt);
