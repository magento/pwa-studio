import React from 'react';

import BrainTreeDropin from '../../Checkout/braintreeDropin';

const CreditCardPaymentInformation = props => {
    return (
        <BrainTreeDropin
            containerID="checkout_page_payment_information"
            onError={console.error}
            onReady={console.log}
            onSuccess={console.warn}
            shouldRequestPaymentNonce={false}
        />
    );
};

export default CreditCardPaymentInformation;
