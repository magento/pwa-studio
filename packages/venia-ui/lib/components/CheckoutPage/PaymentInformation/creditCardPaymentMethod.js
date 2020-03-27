import React from 'react';

import BrainTreeDropin from '../../Checkout/braintreeDropin';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = ({ isHidden }) => {
    const creditCardComponent = isHidden ? null : (
        <BrainTreeDropin
            containerID="checkout_page_payment_information"
            onError={console.error}
            onReady={console.log}
            onSuccess={console.warn}
            shouldRequestPaymentNonce={false}
        />
    );

    return <div className={defaultClasses.root}>{creditCardComponent}</div>;
};

export default CreditCardPaymentInformation;
