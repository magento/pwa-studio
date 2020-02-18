import React, { Fragment } from 'react';

import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import Button from '../Button';
import PriceSummary from './PriceSummary';
import PriceAdjustments from './PriceAdjustments';
import PaymentInformation from './PaymentInformation';
import ShippingInformation from './ShippingInformation';

import { mergeClasses } from '../../classify';

import defaultClasses from './checkoutPage.css';

const SignInSection = props => {
    const { classes, handleSignIn } = props;

    return (
        <Fragment>
            <div className={classes.signInMessage}>Quick Checkout</div>
            <Button
                className={classes.signInButton}
                onClick={handleSignIn}
                priority="high"
            >
                {'Sign In'}
            </Button>
        </Fragment>
    );
};

const GreetingMessage = props => {
    const { isGuestCheckout } = props;

    return isGuestCheckout ? (
        <div>Guest Checkout</div>
    ) : (
        <div>Review and Place Order</div>
    );
};

export default props => {
    const { classes: propClasses } = props;
    const [{ isGuestCheckout }, { handleSignIn }] = useCheckoutPage();

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <Fragment>
            {isGuestCheckout ? (
                <SignInSection
                    classes={{
                        signInButton: classes.signInButton,
                        signInMessage: classes.signInMessage
                    }}
                    handleSignIn={handleSignIn}
                />
            ) : null}
            <GreetingMessage isGuestCheckout={isGuestCheckout} />
            <PriceSummary />
            <div className={classes.price_adjustments_container}>
                <PriceAdjustments />
            </div>
            <PaymentInformation />
            <ShippingInformation />
        </Fragment>
    );
};
