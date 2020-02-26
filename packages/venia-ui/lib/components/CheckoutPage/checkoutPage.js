import React, { Fragment } from 'react';

import { useCheckoutPage } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';

import { Title } from '../../components/Head';
import Button from '../Button';
import PriceSummary from './PriceSummary';
import PriceAdjustments from './PriceAdjustments';
import PaymentInformation from './PaymentInformation';
import ShippingMethod from './ShippingMethod';
import ShippingInformation from './ShippingInformation';
import ItemsReview from './ItemsReview';
import OrderConfirmationPage from './OrderConfirmationPage';
import CREATE_CART_MUTATION from '../../queries/createCart.graphql';
import GET_CART_DETAILS_QUERY from '../../queries/getCartDetails.graphql';

import { mergeClasses } from '../../classify';

import defaultClasses from './checkoutPage.css';

const GuestCheckoutOptions = props => {
    const { classes, handleSignIn } = props;

    return (
        <div className={classes.signin_container}>
            <Button
                className={classes.sign_in}
                onClick={handleSignIn}
                priority="high"
            >
                {'Login and Checkout Faster'}
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
        <div className={classes.empty_cart_container}>
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
    const talonProps = useCheckoutPage({
        createCartMutation: CREATE_CART_MUTATION,
        getCartDetailsQuery: GET_CART_DETAILS_QUERY
    });
    const [
        {
            isGuestCheckout,
            isCartEmpty,
            shippingInformationDone,
            shippingMethodDone,
            paymentInformationDone,
            orderPlaced
        },
        {
            handleSignIn,
            setShippingInformationDone,
            setShippingMethodDone,
            setPaymentInformationDone,
            placeOrder
        }
    ] = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <Title>{`Checkout - ${STORE_NAME}`}</Title>
            {!isCartEmpty ? (
                <Fragment>
                    {isGuestCheckout && (
                        <GuestCheckoutOptions
                            classes={classes}
                            handleSignIn={handleSignIn}
                        />
                    )}
                    <GreetingMessage
                        isGuestCheckout={isGuestCheckout}
                        classes={classes}
                    />
                    <div className={classes.body}>
                        <div className={classes.shipping_information_container}>
                            <ShippingInformation
                                onSave={setShippingInformationDone}
                                doneEditing={shippingInformationDone}
                            />
                        </div>
                        {shippingInformationDone ? (
                            <div className={classes.shipping_method_container}>
                                <ShippingMethod
                                    onSave={setShippingMethodDone}
                                    doneEditing={shippingMethodDone}
                                />
                            </div>
                        ) : (
                            <h2 className={classes.shipping_method_heading}>
                                Shipping Method
                            </h2>
                        )}
                        {shippingInformationDone && shippingMethodDone ? (
                            <Fragment>
                                <div
                                    className={
                                        classes.payment_information_container
                                    }
                                >
                                    <PaymentInformation
                                        doneEditing={paymentInformationDone}
                                    />
                                </div>
                                {paymentInformationDone ? (
                                    <Fragment>
                                        <div
                                            className={
                                                classes.items_review_container
                                            }
                                        >
                                            <ItemsReview />
                                        </div>
                                        <Button
                                            onClick={placeOrder}
                                            priority="high"
                                            className={
                                                classes.place_order_button
                                            }
                                        >
                                            {'Place Order'}
                                        </Button>
                                    </Fragment>
                                ) : (
                                    <Fragment>
                                        <div
                                            className={
                                                classes.price_adjustments_container
                                            }
                                        >
                                            <PriceAdjustments />
                                        </div>

                                        <Button
                                            onClick={setPaymentInformationDone}
                                            priority="high"
                                            className={
                                                classes.review_order_button
                                            }
                                        >
                                            {'Review Order'}
                                        </Button>
                                    </Fragment>
                                )}
                            </Fragment>
                        ) : (
                            <h2 className={classes.payment_information_heading}>
                                Payment Information
                            </h2>
                        )}
                        <div className={classes.summary_container}>
                            <div className={classes.summary_contents}>
                                <PriceSummary />
                            </div>
                        </div>
                    </div>
                </Fragment>
            ) : orderPlaced ? (
                <OrderConfirmationPage />
            ) : (
                <EmptyCartMessage
                    classes={classes}
                    isGuestCheckout={isGuestCheckout}
                />
            )}
        </div>
    );
};
