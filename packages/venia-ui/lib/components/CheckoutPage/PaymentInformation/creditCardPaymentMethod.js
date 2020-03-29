import React from 'react';

import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/useCreditCard';

import BrainTreeDropin from './brainTreeDropIn';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = props => {
    const { shouldRequestPaymentNonce, isHidden } = props;
    const {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady
    } = useCreditCard();

    const creditCardComponent = isHidden ? null : (
        <BrainTreeDropin
            onError={onPaymentError}
            onReady={onPaymentReady}
            onSuccess={onPaymentSuccess}
            shouldRequestPaymentNonce={shouldRequestPaymentNonce}
        />
    );

    return <div className={defaultClasses.root}>{creditCardComponent}</div>;
};

export default CreditCardPaymentInformation;
