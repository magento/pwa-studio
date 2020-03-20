import React, { Fragment } from 'react';

import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
import Button from '../Button';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import OrderConfirmationPage from './OrderConfirmationPage';
import ItemsReview from './ItemsReview';

import CheckoutPageOperations from './checkoutPage.gql.js';

import { mergeClasses } from '../../classify';

import defaultClasses from './checkoutPage.css';

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const talonProps = useCheckoutPage({
        ...CheckoutPageOperations
    });

    const {
        // Enum, one of:
        // SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
        checkoutStep,
        handleSignIn,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        placeOrder,
        receiptData,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    let content;
    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    if (receiptData) {
        content = <OrderConfirmationPage receiptData={receiptData} />;
    } else if (isCartEmpty) {
        content = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {isGuestCheckout ? 'Guest Checkout' : 'Checkout'}
                    </h1>
                </div>
                <h3>There are no items in your cart.</h3>
            </div>
        );
    } else {
        const loginButton = isGuestCheckout ? (
            <div className={classes.signin_container}>
                <Button
                    className={classes.sign_in}
                    onClick={handleSignIn}
                    priority="high"
                >
                    {'Login and Checkout Faster'}
                </Button>
            </div>
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod onSave={setShippingMethodDone} />
            ) : (
                <h2 className={defaultClasses.shipping_method_heading}>
                    Shipping Method
                </h2>
            );

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation onSave={setPaymentInformationDone} />
            ) : (
                <h2 className={defaultClasses.payment_information_heading}>
                    Payment Information
                </h2>
            );

        const itemsReview =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <div className={classes.items_review_container}>
                    <ItemsReview />
                </div>
            ) : null;

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={placeOrder}
                    priority="high"
                    className={classes.place_order_button}
                >
                    {'Place Order'}
                </Button>
            ) : null;

        content = (
            <Fragment>
                {loginButton}
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {isGuestCheckout
                            ? 'Guest Checkout'
                            : 'Review and Place Order'}
                    </h1>
                </div>
                <div className={classes.shipping_information_container}>
                    <ShippingInformation onSave={setShippingInformationDone} />
                </div>
                <div className={classes.shipping_method_container}>
                    {shippingMethodSection}
                </div>
                <div className={classes.payment_information_container}>
                    {paymentInformationSection}
                </div>
                {itemsReview}
                <div className={classes.summary_container}>
                    <OrderSummary isUpdating={isUpdating} />
                </div>
                {placeOrderButton}
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {content}
        </div>
    );
};

export default CheckoutPage;
