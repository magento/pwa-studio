import React from 'react';

import BrainTreeDropin from './brainTreeDropIn';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = ({ isHidden }) => {
    const creditCardComponent = isHidden ? null : (
        <BrainTreeDropin
            onError={console.error}
            onReady={console.log}
            onSuccess={console.warn}
            shouldRequestPaymentNonce={false}
        />
    );

    return <div className={defaultClasses.root}>{creditCardComponent}</div>;
};

export default CreditCardPaymentInformation;
