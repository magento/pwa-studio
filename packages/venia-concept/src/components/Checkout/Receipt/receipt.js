import React, { Component } from 'react';
import { func, shape, string } from 'prop-types';
import classify from 'src/classify';
import Button, { darkThemeClasses } from 'src/components/Button';
import defaultClasses from './receipt.css';
import currentSessionLastOrderQuery from "../../../queries/getCurrentSessionLastOrder.graphql";
import {Query} from "react-apollo";

export const CONTINUE_SHOPPING_BUTTON_ID = 'continue-shopping-button';
export const CREATE_ACCOUNT_BUTTON_ID = 'create-account-button';

class Receipt extends Component {
    static propTypes = {
        classes: shape({
            body: string,
            footer: string,
            root: string
        }),
        continueShopping: func,
        order: shape({
            id: string
        }),
        createAccount: func,
        reset: func
    };

    static defaultProps = {
        order: {},
        continueShopping: () => {},
        reset: () => {},
        createAccount: () => {}
    };

    componentWillUnmount() {
        this.props.reset();
    }

    createAccount = () => {
        this.props.createAccount(this.props.history);
    };

    continueShopping = () => {
        this.props.continueShopping(this.props.history);
    };

    render() {
        const {
            classes,
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
                        <Query query={currentSessionLastOrderQuery}>
                            {({ loading, error, data }) => {
                                if (error) {
                                    return (
                                        <span className={classes.fetchError}>
                                            Data Fetch Error: <pre>{error.message}</pre>
                                        </span>
                                    );
                                }
                                if (loading) {
                                    return (
                                        <span className={classes.fetchingData}>
                                            Fetching Data
                                        </span>
                                    );
                                }
                                if (data.currentSessionLastOrder.increment_id === null) {
                                    return (
                                        <div className={classes.noResults}>
                                            Order data unavailable
                                        </div>
                                    );
                                }

                                return (
                                    <span className={classes.orderId}>
                                        {data.currentSessionLastOrder.increment_id}
                                    </span>
                                );
                            }}
                        </Query>
                        <br />
                        We&rsquo;ll email you an order confirmation with details
                        and tracking info
                    </div>
                    <Button
                        data-id={CONTINUE_SHOPPING_BUTTON_ID}
                        classes={darkThemeClasses}
                        onClick={this.continueShopping}
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
