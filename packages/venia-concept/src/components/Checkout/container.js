import React from 'react';
import { connect } from 'src/drivers';
import { array, bool, func, object, oneOf, shape, string } from 'prop-types';

import {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
} from 'src/actions/checkout';

import Flow from './flow';

const hasData = value => !!value;
const isCartReady = cart => cart.details.items_count > 0;
const isCheckoutReady = checkout => {
    const {
        billingAddress,
        paymentData,
        shippingAddress,
        shippingMethod
    } = checkout;

    return [billingAddress, paymentData, shippingAddress, shippingMethod].every(
        hasData
    );
};

// TODO: This is exported for testing, but I think we should split this into a
// separate file entirely and just do the prop/action shaping here in this file.
export const CheckoutContainer = props => {
    const {
        beginCheckout,
        cancelCheckout,
        cart,
        checkout,
        directory,
        editOrder,
        requestOrder,
        submitShippingAddress,
        submitOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod,
        user
    } = props;

    // ensure state slices are present
    if (!(cart && checkout)) {
        return null;
    }

    const actions = {
        beginCheckout,
        cancelCheckout,
        editOrder,
        requestOrder,
        submitShippingAddress,
        submitOrder,
        submitPaymentMethodAndBillingAddress,
        submitShippingMethod
    };

    const { paymentData, shippingAddress, shippingMethod } = checkout;

    const flowProps = {
        actions,
        cart,
        checkout,
        directory,
        user,
        hasPaymentMethod: hasData(paymentData),
        hasShippingAddress: hasData(shippingAddress),
        hasShippingMethod: hasData(shippingMethod),
        isCartReady: isCartReady(cart),
        isCheckoutReady: isCheckoutReady(checkout)
    };

    return <Flow {...flowProps} />;
};

CheckoutContainer.propTypes = {
    beginCheckout: func,
    cancelCheckout: func,
    cart: shape({
        details: object.isRequired,
        cartId: string,
        totals: object
    }).isRequired,
    checkout: shape({
        availableShippingMethods: array,
        billingAddress: shape({
            city: string,
            country_id: string,
            email: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            region_code: string,
            region: string,
            street: array,
            telephone: string
        }),
        editing: oneOf(['address', 'paymentMethod', 'shippingMethod']),
        incorrectAddressMessage: string,
        isAddressIncorrect: bool,
        paymentCode: string,
        paymentData: shape({
            description: string,
            details: shape({
                cardType: string
            }),
            nonce: string
        }),
        shippingAddress: shape({
            city: string,
            country_id: string,
            email: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            region_code: string,
            region: string,
            street: array,
            telephone: string
        }),
        shippingMethod: string,
        shippingTitle: string,
        step: oneOf(['cart', 'form', 'receipt']).isRequired,
        submitting: bool.isRequired
    }),
    directory: shape({
        countries: array
    }),
    editOrder: func,
    submitShippingAddress: func,
    submitOrder: func,
    submitPaymentMethodAndBillingAddress: func,
    submitShippingMethod: func,
    user: shape({
        isSignedIn: bool
    })
};

const mapStateToProps = ({ cart, checkout, directory, user }) => ({
    cart,
    checkout,
    directory,
    user
});

const mapDispatchToProps = {
    beginCheckout,
    cancelCheckout,
    editOrder,
    submitShippingAddress,
    submitOrder,
    submitPaymentMethodAndBillingAddress,
    submitShippingMethod
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CheckoutContainer);
