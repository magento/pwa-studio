import React from 'react';

import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/useCreditCard';

import BrainTreeDropin from './brainTreeDropIn';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = props => {
    const {
        shouldRequestPaymentNonce,
        isHidden,
        doneEditing,
        setDoneEditing
    } = props;
    const {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        paymentNonce
    } = useCreditCard({ setDoneEditing });

    const creditCardComponent = isHidden ? null : doneEditing ? (
        <div className={defaultClasses.summary}>
            <span>Credit Card</span>
            <span>{`${paymentNonce.details.cardType} ending in ${
                paymentNonce.details.lastFour
            }`}</span>
        </div>
    ) : (
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
