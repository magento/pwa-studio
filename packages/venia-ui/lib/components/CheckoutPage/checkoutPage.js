import React, { Fragment, useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { Link } from 'react-router-dom';

import { useWindowSize, useToasts } from '@magento/peregrine';
import {
    CHECKOUT_STEP,
    useCheckoutPage
} from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { mergeClasses } from '../../classify';
import Button from '../Button';
import { Title } from '../Head';
import Icon from '../Icon';
import LinkButton from '../LinkButton';
import { fullPageLoadingIndicator } from '../LoadingIndicator';
import StockStatusMessage from '../StockStatusMessage';
import AddressBook from './AddressBook';
import OrderSummary from './OrderSummary';
import PaymentInformation from './PaymentInformation';
import PriceAdjustments from './PriceAdjustments';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import OrderConfirmationPage from './OrderConfirmationPage';
import ItemsReview from './ItemsReview';
import defaultClasses from './checkoutPage.css';
import CheckoutPageOperations from './checkoutPage.gql.js';

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const talonProps = useCheckoutPage({
        ...CheckoutPageOperations
    });

    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        cartItems,
        checkoutStep,
        customer,
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
        setCheckoutStep,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleActiveContent
    } = talonProps;

    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : 'Oops! An error occurred while submitting. Please try again.';

            addToast({
                type: 'error',
                icon: errorIcon,
                message,
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

    let checkoutContent;

    if (orderNumber) {
        return (
            <OrderConfirmationPage
                data={orderDetailsData}
                orderNumber={orderNumber}
            />
        );
    } else if (isLoading) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {isGuestCheckout ? 'Guest Checkout' : 'Checkout'}
                    </h1>
                </div>
                <h3>{'There are no items in your cart.'}</h3>
            </div>
        );
    } else {
        const loginButton = isGuestCheckout ? (
            <div className={classes.signin_container}>
                <LinkButton className={classes.sign_in} onClick={handleSignIn}>
                    {'Login and Checkout Faster'}
                </LinkButton>
            </div>
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod
                    pageIsUpdating={isUpdating}
                    onSave={setShippingMethodDone}
                    setPageIsUpdating={setIsUpdating}
                />
            ) : (
                <h3 className={classes.shipping_method_heading}>
                    {'2. Shipping Method'}
                </h3>
            );

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                />
            ) : (
                <h3 className={classes.payment_information_heading}>
                    {'3. Payment Information'}
                </h3>
            );

        const priceAdjustmentsSection =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <div className={classes.price_adjustments_container}>
                    <PriceAdjustments setPageIsUpdating={setIsUpdating} />
                </div>
            ) : null;

        const reviewOrderButton =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handleReviewOrder}
                    priority="high"
                    className={classes.review_order_button}
                    disabled={reviewOrderButtonClicked || isUpdating}
                >
                    {'Review Order'}
                </Button>
            ) : null;

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
            : customer.default_shipping
            ? 'Review and Place Order'
            : `Welcome ${customer.firstname}!`;

        const checkoutContentClass =
            activeContent === 'checkout'
                ? classes.checkoutContent
                : classes.checkoutContent_hidden;

        const stockStatusMessageElement = (
            <Fragment>
                {
                    'An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item.'
                }{' '}
                <Link className={classes.cartLink} to={'/cart'}>
                    Return to Cart
                </Link>
            </Fragment>
        );
        checkoutContent = (
            <div className={checkoutContentClass}>
                {loginButton}
                <div className={classes.heading_container}>
                    <StockStatusMessage
                        cartItems={cartItems}
                        message={stockStatusMessageElement}
                    />
                    <h1 className={classes.heading}>
                        {guestCheckoutHeaderText}
                    </h1>
                </div>
                <div className={classes.shipping_information_container}>
                    <ShippingInformation
                        onSave={setShippingInformationDone}
                        toggleActiveContent={toggleActiveContent}
                    />
                </div>
                <div className={classes.shipping_method_container}>
                    {shippingMethodSection}
                </div>
                <div className={classes.payment_information_container}>
                    {paymentInformationSection}
                </div>
                {priceAdjustmentsSection}
                {reviewOrderButton}
                {itemsReview}
                {orderSummary}
                {placeOrderButton}
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleActiveContent}
        />
    ) : null;

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {checkoutContent}
            {addressBookElement}
        </div>
    );
};

export default CheckoutPage;
