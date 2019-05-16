import React, { Fragment, useCallback, useEffect } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { mergeClasses } from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './receipt.css';

export const VIEW_ORDER_DETAILS_BUTTON_ID = 'view-order-details-button';
export const CREATE_ACCOUNT_BUTTON_ID = 'create-account-button';

const Receipt = props => {
    const { createAccount, history, reset, user } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    const handleCreateAccount = useCallback(() => {
        createAccount(history);
    }, [createAccount, history]);

    const handleViewOrderDetails = useCallback(() => {
        // TODO: Implement/connect/redirect to order details page.
    }, [props.order]);

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <h2 className={classes.header}>Thank you for your purchase!</h2>
                <div className={classes.textBlock}>
                    You will receive an order confirmation email with order
                    status and other details.
                    <br />
                    {user.isSignedIn &&
                        'You can also visit your account page for more information.'}
                </div>
                {user.isSignedIn && (
                    <Button
                        data-id={VIEW_ORDER_DETAILS_BUTTON_ID}
                        onClick={handleViewOrderDetails}
                    >
                        View Order Details
                    </Button>
                )}
                {!user.isSignedIn && (
                    <Fragment>
                        <hr />
                        <div className={classes.textBlock}>
                            Track order status and earn rewards for your
                            purchase by creating and account.
                        </div>
                        <Button
                            data-id={CREATE_ACCOUNT_BUTTON_ID}
                            priority="high"
                            onClick={handleCreateAccount}
                        >
                            Create an Account
                        </Button>
                    </Fragment>
                )}
            </div>
        </div>
    );
};

Receipt.propTypes = {
    classes: shape({
        body: string,
        footer: string,
        root: string
    }),
    order: shape({
        id: string
    }).isRequired,
    createAccount: func.isRequired,
    reset: func.isRequired,
    user: shape({
        isSignedIn: bool
    })
};

Receipt.defaultProps = {
    order: {},
    reset: () => {},
    createAccount: () => {}
};

export default Receipt;
