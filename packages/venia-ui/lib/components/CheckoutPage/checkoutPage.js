import React, { Fragment } from 'react';

import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
import Button from '../Button';
import PriceSummary from './PriceSummary';
import ItemsReview from './ItemsReview';
import OrderConfirmationPage from './OrderConfirmationPage';
import PaymentInformation from './PaymentInformation';
import PriceAdjustments from './PriceAdjustments';
import ShippingInformation from './ShippingInformation';
import ShippingMethod from './ShippingMethod';

import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';
import { SIGN_OUT } from './checkoutPage.gql';

import { mergeClasses } from '../../classify';

import defaultClasses from './checkoutPage.css';

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const talonProps = useCheckoutPage({
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        mutations: {
            signOutMutation: SIGN_OUT
        }
    });
    const {
        handleSignInToggle,
        isCartEmpty,
        isSignedIn,
        orderPlaced,
        paymentInformationDone,
        placeOrder,
        setPaymentInformationDone,
        setShippingInformationDone,
        setShippingMethodDone,
        shippingInformationDone,
        shippingMethodDone
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const showPriceAdjustments =
        shippingInformationDone &&
        shippingMethodDone &&
        !paymentInformationDone;

    const priceAdjustments = showPriceAdjustments ? (
        <div className={classes.price_adjustments_container}>
            <PriceAdjustments />
        </div>
    ) : null;

    const showItemsReview =
        shippingInformationDone && shippingMethodDone && paymentInformationDone;

    const itemsReview = showItemsReview ? (
        <div className={classes.items_review_container}>
            <ItemsReview />
        </div>
    ) : null;

    const showOrderConfirmation = isCartEmpty && orderPlaced;

    const orderConfirmation = showOrderConfirmation ? (
        <OrderConfirmationPage />
    ) : null;

    const emptyCart =
        isCartEmpty && !orderPlaced ? (
            <div className={classes.empty_cart_container}>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        {isSignedIn ? 'Checkout' : 'Guest Checkout'}
                    </h1>
                </div>
                <h3>There are no items in your cart.</h3>
            </div>
        ) : null;

    const showPlaceOrderButton =
        shippingInformationDone && shippingMethodDone && paymentInformationDone;

    const placeOrderButton = showPlaceOrderButton ? (
        <Button
            onClick={placeOrder}
            priority="high"
            className={classes.place_order_button}
        >
            {'Place Order'}
        </Button>
    ) : null;

    const showReviewOrderButton =
        shippingInformationDone &&
        shippingMethodDone &&
        !paymentInformationDone;

    const reviewOrderButton = showReviewOrderButton ? (
        <Button
            onClick={setPaymentInformationDone}
            priority="high"
            className={classes.review_order_button}
        >
            {'Review Order'}
        </Button>
    ) : null;

    const signInToggleText = isSignedIn ? 'Sign Out' : 'Sign In';

    const checkoutSteps = !isCartEmpty ? (
        <Fragment>
            <Button onClick={handleSignInToggle}>
                {signInToggleText}
            </Button>
            <div className={classes.heading_container}>
                <h1 className={classes.heading}>
                    {isSignedIn
                        ? 'Review and Place Order'
                        : 'Guest Checkout'}
                </h1>
            </div>
            <div className={classes.body}>
                <div className={classes.shipping_information_container}>
                    <ShippingInformation
                        onSave={setShippingInformationDone}
                        doneEditing={shippingInformationDone}
                    />
                </div>
                <div className={classes.shipping_method_container}>
                    <ShippingMethod
                        onSave={setShippingMethodDone}
                        doneEditing={shippingMethodDone}
                        showContent={shippingInformationDone}
                    />
                </div>
                <div className={classes.payment_information_container}>
                    <PaymentInformation
                        doneEditing={paymentInformationDone}
                        showContent={
                            shippingInformationDone && shippingMethodDone
                        }
                    />
                </div>
                {priceAdjustments}
                {itemsReview}
                <div className={classes.summary_container}>
                    <div className={classes.summary_contents}>
                        <PriceSummary />
                    </div>
                </div>
                {reviewOrderButton}
                {placeOrderButton}
            </div>
        </Fragment>
    ) : null;

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {checkoutSteps}
            {orderConfirmation}
            {emptyCart}
        </div>
    );
};

export default CheckoutPage;
