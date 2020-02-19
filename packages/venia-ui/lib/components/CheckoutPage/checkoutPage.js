import React, { useCallback, Fragment } from 'react';

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

            {renderIfGuestCheckout(() => (
                <GuestCheckoutOptions
                    classes={classes}
                    handleSignIn={handleSignIn}
                />
            ))}
            <GreetingMessage
                isGuestCheckout={isGuestCheckout}
                classes={classes}
            />
            {renderIfCartNotEmpty(
                () => (
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
                        {renderIfShippingInformationDone(() => (
                            <Fragment>
                                <div
                                    className={`${
                                        classes.shipping_method_container
                                    } ${classes.section_container}`}
                                >
                                    <ShippingMethod
                                        onSave={setShippingMethodDone}
                                    />
                                </div>
                                {renderIfShippingMethodDone(() => (
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
                ),
                () => (
                    <h3>There are no items in your cart.</h3>
                )
            )}
        </div>
    );
};
