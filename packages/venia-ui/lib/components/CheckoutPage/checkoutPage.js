import React, { useCallback, Fragment } from 'react';

import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
import Button from '../Button';
import PriceSummary from './PriceSummary';
import PriceAdjustments from './PriceAdjustments';
import PaymentInformation from './PaymentInformation';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';

import { renderIf } from './utilities';
import { mergeClasses } from '../../classify';

import defaultClasses from './checkoutPage.css';

const GuestCheckoutOptions = props => {
    const { classes, handleSignIn } = props;

    return (
        <div className={classes.signin_container}>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>Quick Checkout</h1>
            </div>
            <Button
                className={classes.sign_in}
                onClick={handleSignIn}
                priority="high"
            >
                {'Login to Checkout Faster'}
            </Button>
        </div>
    );
};

const GreetingMessage = props => {
    const { isGuestCheckout, classes } = props;

    return (
        <div className={classes.heading_container}>
            <h1 className={classes.heading}>
                {isGuestCheckout ? 'Guest Checkout' : 'Review and Place Order'}
            </h1>
        </div>
    );
};

const EmptyCartMessage = props => {
    const { classes, isGuestCheckout } = props;

    return (
        <div className={classes.signin_container}>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>
                    {isGuestCheckout ? 'Guest Checkout' : 'Checkout'}
                </h1>
            </div>
            <h3>There are no items in your cart.</h3>
        </div>
    );
};

export default props => {
    const { classes: propClasses } = props;
    const [
        {
            isGuestCheckout,
            isCartEmpty,
            shippingInformationDone,
            shippingMethodDone
        },
        { handleSignIn, setShippingInformationDone, setShippingMethodDone }
    ] = useCheckoutPage();

    const classes = mergeClasses(defaultClasses, propClasses);

    const renderIfGuestCheckout = useCallback(renderIf(isGuestCheckout), [
        isGuestCheckout
    ]);
    const renderIfCartNotEmpty = useCallback(renderIf(!isCartEmpty), [
        isCartEmpty
    ]);
    const renderIfShippingInformationDone = useCallback(
        renderIf(shippingInformationDone)
    );
    const renderIfShippingMethodDone = useCallback(
        renderIf(shippingMethodDone)
    );

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {/**
             * Lazy rendering checkout page components only
             * if the cart is not empty.
             */
            renderIfCartNotEmpty(
                () => (
                    <Fragment>
                        {/**
                         * Lazy rendering Guest checkout options
                         * only if use is not signed in.
                         */
                        renderIfGuestCheckout(() => (
                            <GuestCheckoutOptions
                                classes={classes}
                                handleSignIn={handleSignIn}
                            />
                        ))}
                        <GreetingMessage
                            isGuestCheckout={isGuestCheckout}
                            classes={classes}
                        />
                        <div className={classes.body}>
                            <div
                                className={`${
                                    classes.shipping_information_container
                                } ${classes.section_container}`}
                            >
                                <ShippingInformation
                                    onSave={setShippingInformationDone}
                                    doneEditing={shippingInformationDone}
                                />
                            </div>
                            {/**
                             * Lazy rendering Shipping method component
                             * only if shipping information component is
                             * done editing.
                             */
                            renderIfShippingInformationDone(() => (
                                <Fragment>
                                    <div
                                        className={`${
                                            classes.shipping_method_container
                                        } ${classes.section_container}`}
                                    >
                                        <ShippingMethod
                                            onSave={setShippingMethodDone}
                                            doneEditing={shippingMethodDone}
                                        />
                                    </div>
                                    {/**
                                     * Lazy rendering Payment information and price
                                     * adjustments components if the shipping method
                                     * component is done editing.
                                     */
                                    renderIfShippingMethodDone(() => (
                                        <Fragment>
                                            <div
                                                className={`${
                                                    classes.payment_information_container
                                                } ${classes.section_container}`}
                                            >
                                                <PaymentInformation />
                                            </div>
                                            <div
                                                className={
                                                    classes.price_adjustments_container
                                                }
                                            >
                                                <PriceAdjustments />
                                            </div>
                                        </Fragment>
                                    ))}
                                </Fragment>
                            ))}
                            <div className={classes.summary_container}>
                                <div
                                    className={`${classes.summary_contents} ${
                                        classes.section_container
                                    }`}
                                >
                                    <PriceSummary />
                                </div>
                            </div>
                        </div>
                    </Fragment>
                ),
                /**
                 * Rendering empty cart component if the cart is emtpy.
                 */
                <EmptyCartMessage
                    classes={classes}
                    isGuestCheckout={isGuestCheckout}
                />
            )}
        </div>
    );
};
