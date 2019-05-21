import React, { Fragment, useCallback, useEffect } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { mergeClasses } from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './receipt.css';

const Receipt = props => {
    const { createAccount, history, order, reset, user } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    useEffect(() => reset, [reset]);

    const handleCreateAccount = useCallback(() => {
        createAccount(history);
    }, [createAccount, history]);

    const handleViewOrderDetails = useCallback(() => {
        // TODO: Implement/connect/redirect to order details page.
    }, [order]);

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <h2 className={classes.header}>Thank you for your purchase!</h2>
                <div className={classes.textBlock}>
                    You will receive an order confirmation email with order
                    status and other details.
                </div>
                {user.isSignedIn ? (
                    <Fragment>
                        <div className={classes.textBlock}>
                            You can also visit your account page for more
                            information.
                        </div>
                        <Button onClick={handleViewOrderDetails}>
                            View Order Details
                        </Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <hr />
                        <div className={classes.textBlock}>
                            Track order status and earn rewards for your
                            purchase by creating an account.
                        </div>
                        <Button priority="high" onClick={handleCreateAccount}>
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
