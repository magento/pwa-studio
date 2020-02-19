import React, { useCallback } from 'react';

import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
import Button from '../Button';
import PriceSummary from './PriceSummary';
import PriceAdjustments from './PriceAdjustments';
import PaymentInformation from './PaymentInformation';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';

import { mergeClasses } from '../../classify';

import defaultClasses from './checkoutPage.css';

const renderIf = booleanCondition => (IfComp, ElseComp) => {
    if (booleanCondition) {
        return <IfComp />;
    } else {
        return ElseComp ? <ElseComp /> : null;
    }
};

const GuestCheckoutOptions = props => {
    const { classes, handleSignIn, handlePaypal } = props;

    return (
        <div>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Quick Checkout</h1>
            </div>
            <Button
                className={classes.sign_in}
                onClick={handleSignIn}
                priority="high"
            >
                {'Sign In'}
            </Button>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Express Checkout</h1>
            </div>
            <Button
                className={classes.sign_in}
                onClick={handlePaypal}
                priority="high"
            >
                {'PayPal'}
            </Button>
        </div>
    );
};

const GreetingMessage = props => {
    const { isGuestCheckout, classes } = props;

    return (
        <h1 className={classes.heading}>
            {isGuestCheckout ? 'Guest Checkout' : 'Review and Place Order'}
        </h1>
    );
};

export default props => {
    const { classes: propClasses } = props;
    const [
        { isGuestCheckout, isCartEmpty },
        { handleSignIn, handlePaypal }
    ] = useCheckoutPage();

    const classes = mergeClasses(defaultClasses, propClasses);
    const renderIfGuestCheckout = useCallback(renderIf(isGuestCheckout), [
        isGuestCheckout
    ]);
    const renderIfCartNotEmpty = useCallback(renderIf(!isCartEmpty), [
        isCartEmpty
    ]);

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>

            {renderIfGuestCheckout(() => (
                <GuestCheckoutOptions
                    classes={classes}
                    handleSignIn={handleSignIn}
                    handlePaypal={handlePaypal}
                />
            ))}
            <GreetingMessage
                isGuestCheckout={isGuestCheckout}
                classes={classes}
            />
            {renderIfCartNotEmpty(
                () => (
                    <div className={classes.body}>
                        <div className={classes.price_adjustments_container}>
                            <ShippingMethod />
                            <ShippingInformation />
                            <PaymentInformation />
                            <div
                                className={classes.price_adjustments_container}
                            >
                                <PriceAdjustments />
                            </div>
                        </div>
                        <div className={classes.summary_container}>
                            <div className={classes.summary_contents}>
                                <PriceSummary />
                            </div>
                        </div>
                    </div>
                ),
                () => (
                    <h3>There are no items in your cart.</h3>
                )
            )}
        </div>
    );
};
