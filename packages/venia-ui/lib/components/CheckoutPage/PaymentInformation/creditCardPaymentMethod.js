import React from 'react';

import BrainTreeDropin from '../../Checkout/braintreeDropin';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = () => {
    return (
        <div className={defaultClasses.root}>
            <BrainTreeDropin
                containerID="checkout_page_payment_information"
                onError={console.error}
                onReady={console.log}
                onSuccess={console.warn}
                shouldRequestPaymentNonce={false}
            />
        </div>
    );
};

export default CreditCardPaymentInformation;
