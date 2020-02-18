import React, { Fragment } from 'react';

import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
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
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Guest Checkout</h1>
            </div>
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
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {isGuestCheckout ? (
                <SignInSection classes={classes} handleSignIn={handleSignIn} />
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
