import React, { Fragment } from 'react';
import { func, shape, string } from 'prop-types';

import { useReceipt } from '@magento/peregrine/lib/talons/Checkout/Receipt/useReceipt';

import { useStyle } from '../../../classify';
import Button from '../../Button';
import defaultClasses from './receipt.module.css';

/**
 * A component that displays some basic information about an order and has
 * a call to action for viewing order details and creating an account.
 */
const Receipt = props => {
    const { onClose } = props;
    const talonProps = useReceipt({
        onClose
    });

    const {
        handleCreateAccount,
        handleViewOrderDetails,
        isSignedIn
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const createAccountButtonText = 'Create an Account';
    const viewOrderButtonText = 'View Order Details';

    const ctaText = isSignedIn
        ? 'You can also visit your account page for more information.'
        : 'Track order status and earn rewards for your purchase by creating an account.';

    const content = isSignedIn ? (
        <Fragment>
            <div className={classes.textBlock}>{ctaText}</div>
            <Button onClick={handleViewOrderDetails}>
                {viewOrderButtonText}
            </Button>
        </Fragment>
    ) : (
        <Fragment>
            <hr />
            <div className={classes.textBlock}>{ctaText}</div>
            <Button priority="high" onClick={handleCreateAccount}>
                {createAccountButtonText}
            </Button>
        </Fragment>
    );

    const headingText = 'Thank you for your purchase!';
    const orderConfText =
        'You will receive an order confirmation email with order status and other details.';

    return (
        <div className={classes.root}>
            <div className={classes.body}>
                <h2 className={classes.header}>{headingText}</h2>
                <div className={classes.textBlock}>{orderConfText}</div>
                {content}
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
    drawer: string,
    onClose: func.isRequired,
    order: shape({
        id: string
    }).isRequired
};

Receipt.defaultProps = {
    order: {}
};

export default Receipt;
