import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { bool, func, shape, string } from 'prop-types';

import PaymentMethodSummary from './paymentMethodSummary';
import ShippingAddressSummary from './shippingAddressSummary';
import ShippingMethodSummary from './shippingMethodSummary';
import Section from './section';
import Button from '../Button';
import isObjectEmpty from '../../util/isObjectEmpty';

import { Price, useRestApi } from '@magento/peregrine';
import { useCheckoutContext } from '@magento/peregrine/lib/state/Checkout';
// import { useCartContext } from '@magento/peregrine/lib/state/Cart';
// import { useUserContext } from '@magento/peregrine/lib/state/User';

const AUTHED_PAYMENT_ENDPOINT = '/rest/V1/carts/mine/payment-information';
const AUTHED_SHIPPING_ENDPOINT = '/rest/V1/carts/mine/shipping-information';

/**
 * The Overview component renders summaries for each section of the editable
 * form.
 */
const isCheckoutReady = checkoutState => {
    const {
        billingAddress,
        paymentCode,
        paymentData,
        shippingAddress,
        shippingMethod,
        shippingTitle
    } = checkoutState;

    const objectsHaveData = [
        billingAddress,
        paymentData,
        shippingMethod,
        shippingAddress
    ].every(data => {
        return !!data && !isObjectEmpty(data);
    });

    const stringsHaveData = !!paymentCode && !!shippingTitle;

    return objectsHaveData && stringsHaveData;
};

const Overview = props => {
    const [submitting, setSubmitting] = useState(false);

    // TODO: Uncomment when we fully migrate to new cart state.
    // const [cartState] = useCartContext();
    // const [userState] = useUserContext();
    const [
        checkoutState
        // checkoutApi
    ] = useCheckoutContext();

    const {
        paymentData,
        shippingAddress,
        shippingMethod,
        shippingTitle
    } = checkoutState;

    const {
        cart: cartState,
        cancelCheckout,
        classes,
        setEditing,
        setStep,
        user: userState // TODO: remove when we fully migrate to new user state.
    } = props;

    const { isSignedIn } = userState;

    const { cartId } = cartState;

    const hasPaymentMethod = !!paymentData && !isObjectEmpty(paymentData);
    const hasShippingAddress =
        !!shippingAddress && !isObjectEmpty(shippingAddress);
    const hasShippingMethod =
        !!shippingMethod && !isObjectEmpty(shippingMethod);

    const shippingEndpoint = isSignedIn
        ? AUTHED_SHIPPING_ENDPOINT
        : `/rest/V1/guest-carts/${cartId}/shipping-information`;

    const [
        submitShippingInfoRequestState,
        submitShippingInfoRequestApi
    ] = useRestApi(shippingEndpoint);

    const paymentEndpoint = isSignedIn
        ? AUTHED_PAYMENT_ENDPOINT
        : `/rest/V1/guest-carts/${cartId}/payment-information`;

    const [
        submitPaymentInfoRequestState,
        submitPaymentInfoRequestApi
    ] = useRestApi(paymentEndpoint);

    const handleAddressFormClick = useCallback(() => {
        setEditing('address');
    }, [setEditing]);

    const handlePaymentFormClick = useCallback(() => {
        setEditing('paymentMethod');
    }, [setEditing]);

    const handleShippingFormClick = useCallback(() => {
        setEditing('shippingMethod');
    }, [setEditing]);

    const handleSubmitOrder = useCallback(async () => {
        setSubmitting(true);
        let billingAddress = checkoutState.billingAddress;
        const {
            shippingAddress,
            shippingMethod,
            paymentCode,
            paymentData
        } = checkoutState;

        if (billingAddress.sameAsShippingAddress) {
            billingAddress = shippingAddress;
        }
        await Promise.all([
            // submit shipping info
            await submitShippingInfoRequestApi.sendRequest({
                options: {
                    method: 'POST',
                    body: JSON.stringify({
                        addressInformation: {
                            billingAddress,
                            shippingAddress,
                            shipping_carrier_code: shippingMethod.carrier_code,
                            shipping_method_code: shippingMethod.method_code
                        }
                    })
                }
            }),
            // submit payment info
            await submitPaymentInfoRequestApi.sendRequest({
                options: {
                    method: 'POST',
                    body: JSON.stringify({
                        billingAddress,
                        cartId: cartState.cartId,
                        email: shippingAddress.email,
                        paymentMethod: {
                            additional_data: {
                                payment_method_nonce: paymentData.nonce
                            },
                            method: paymentCode
                        }
                    })
                }
            })
        ]);
    }, [
        cartState,
        checkoutState,
        setSubmitting,
        submitPaymentInfoRequestApi,
        submitShippingInfoRequestApi
    ]);

    useEffect(() => {
        const isLoading =
            submitShippingInfoRequestState.loading &&
            submitPaymentInfoRequestState.loading;

        const hasData =
            submitShippingInfoRequestState.data &&
            submitPaymentInfoRequestState.data;

        const hasError =
            submitShippingInfoRequestState.error ||
            submitPaymentInfoRequestState.error;

        if (!isLoading && hasData) {
            // clear the checkout
            // checkoutApi.submitOrder(); //TODO: Uncomment after dev done. This just makes it so we dont have to reenter data every time.

            // set receipt info from payment endpoint response
            // const response = submitPaymentInfoRequestState.data;

            // receiptApi.setOrder(response, billingAddress)

            // open the receipt
            setStep('receipt');
        }

        if (!isLoading && hasError) {
            console.log(
                `[ERROR] submitting order:`,
                submitShippingInfoRequestState.error,
                submitPaymentInfoRequestState.error
            );
            setSubmitting(false);
        }
    }, [
        setStep,
        submitShippingInfoRequestState,
        submitPaymentInfoRequestState
    ]);

    return (
        <Fragment>
            <div className={classes.body}>
                <Section
                    label="Ship To"
                    onClick={handleAddressFormClick}
                    showEditIcon={hasShippingAddress}
                >
                    <ShippingAddressSummary
                        classes={classes}
                        hasShippingAddress={hasShippingAddress}
                        shippingAddress={shippingAddress}
                    />
                </Section>
                <Section
                    label="Pay With"
                    onClick={handlePaymentFormClick}
                    showEditIcon={hasPaymentMethod}
                >
                    <PaymentMethodSummary
                        classes={classes}
                        hasPaymentMethod={hasPaymentMethod}
                        paymentData={paymentData}
                    />
                </Section>
                <Section
                    label="Use"
                    onClick={handleShippingFormClick}
                    showEditIcon={hasShippingMethod}
                >
                    <ShippingMethodSummary
                        classes={classes}
                        hasShippingMethod={hasShippingMethod}
                        shippingTitle={shippingTitle}
                    />
                </Section>
                <Section label="TOTAL">
                    <Price
                        currencyCode={cartState.totals.quote_currency_code}
                        value={cartState.totals.subtotal || 0}
                    />
                    <br />
                    <span>{cartState.details.items_qty} Items</span>
                </Section>
            </div>
            <div className={classes.footer}>
                <Button onClick={cancelCheckout}>Back to Cart</Button>
                <Button
                    priority="high"
                    disabled={submitting || !isCheckoutReady(checkoutState)}
                    onClick={handleSubmitOrder}
                >
                    Confirm Order
                </Button>
            </div>
        </Fragment>
    );
};

Overview.propTypes = {
    cancelCheckout: func.isRequired,
    classes: shape({
        body: string,
        footer: string
    }),
    setEditing: func,
    submitting: bool
};

export default Overview;
