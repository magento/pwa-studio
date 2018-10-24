import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import classify from 'src/classify';
import Button, { darkThemeClasses } from 'src/components/Button';
import defaultClasses from './receipt.css';

export const CONTINUE_SHOPPING_BUTTON_ID = 'continue-shopping-button';
export const CREATE_ACCOUNT_BUTTON_ID = 'create-account-button';

class Receipt extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        resetCheckout: func,
        order: shape({
            id: string
        }),
        handleCreateAccount: func,
        reset: func
    };

    static defaultProps = {
        order: {},
        resetCheckout: () => {},
        reset: () => {},
        handleCreateAccount: () => {}
    };

    componentWillUnmount() {
        this.props.reset();
    }

    createAccount = () => {
        this.props.handleCreateAccount(this.props.history);
    };

    render() {
        const {
            classes,
            resetCheckout,
            order: { id }
        } = this.props;

        return (
            <div className={classes.root}>
                <div className={classes.body}>
                    <h2 className={classes.header}>
                        Thank you for your purchase!
                    </h2>
                    <div className={classes.textBlock}>
                        Your order # is{' '}
                        <span className={classes.orderId}>{id}</span>
                        <br />
                        We'll email you an order confirmation with details and
                        tracking info
                    </div>
                    <Button
                        data-id={CONTINUE_SHOPPING_BUTTON_ID}
                        classes={darkThemeClasses}
                        onClick={resetCheckout}
                    >
                        Continue Shopping
                    </Button>
                    <div className={classes.textBlock}>
                        Track order status and earn rewards for your purchase by
                        creating and account.
                    </div>
                    <Button
                        data-id={CREATE_ACCOUNT_BUTTON_ID}
                        classes={darkThemeClasses}
                        onClick={this.createAccount}
                    >
                        Create an Account
                    </Button>
                </div>
            </div>
        );
    }
}
export default classify(defaultClasses)(Receipt);
