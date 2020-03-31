import React, { Fragment, useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
import Button from '../Button';
import Icon from '../Icon';
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

const errorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const talonProps = useCheckoutPage({
        ...CheckoutPageOperations
    });

    const {
        // Enum, one of:
        // SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
        checkoutStep,
        error,
        handleSignIn,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        orderDetailsData,
        orderDetailsLoading,
        orderNumber,
        placeOrderLoading,
        // TODO: Utilize this setter when making a mutation
        // setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone
    } = talonProps;

    // Thorw a to
    const [, { addToast }] = useToasts();
    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message:
                    'Oops! An error occurred while submitting. Please try again.',
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, hasError]);

    const classes = mergeClasses(defaultClasses, propClasses);

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 960;

    let content;
    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    if (!placeOrderLoading && !hasError && orderDetailsData) {
        content = (
            <OrderConfirmationPage
                // TODO: It may not be necessary to write an extra query/pass data assuming all the data we need to render has been queried for at some point. Look into this.
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
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
                    onClick={handlePlaceOrder}
                    priority="high"
                    className={classes.place_order_button}
                    disabled={
                        isUpdating || placeOrderLoading || orderDetailsLoading
                    }
                >
                    {'Place Order'}
                </Button>
            ) : null;

        // If we're on mobile we should only render price summary in/after review.
        const shouldRenderPriceSummary = !(
            isMobile && checkoutStep < CHECKOUT_STEP.REVIEW
        );

        const orderSummary = shouldRenderPriceSummary ? (
            <div className={classes.summaryContainer}>
                <OrderSummary isUpdating={isUpdating} />
            </div>
        ) : null;

        const guestCheckoutHeaderText = isGuestCheckout
            ? 'Guest Checkout'
            : 'Review and Place Order';

        content = (
            <Fragment>
                {loginButton}
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {guestCheckoutHeaderText}
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
                {orderSummary}
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
