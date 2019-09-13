import React, { Fragment, useCallback, useEffect, useRef } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { mergeClasses } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './receipt.css';

const Receipt = props => {
    const { createAccount, drawer, history, reset, onClose, user } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    // When the drawer is closed reset the state of the receipt. We use a ref
    // because drawer can change if the mask is clicked. Mask updates drawer.
    const prevDrawer = useRef(null);
    useEffect(() => {
        if (prevDrawer.current === 'cart' && drawer !== 'cart') {
            reset();
            onClose();
        }
        prevDrawer.current = drawer;
    }, [drawer, onClose, reset]);

    const handleCreateAccount = useCallback(() => {
        createAccount(history);
    }, [createAccount, history]);

    const handleViewOrderDetails = useCallback(() => {
        // TODO: Implement/connect/redirect to order details page.
    }, []);

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
    onClose: func.isRequired,
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
