import React from 'react';
import { bool, func } from 'prop-types';
import CustomerCreditSystem from './CustomerCreditSystem';

const PaymentMethods = props => {
    console.log('PaymentMethods');
    console.log(props);

    const { onPaymentError, onPaymentSuccess, resetShouldSubmit, shouldSubmit } = props;

    return (
        <CustomerCreditSystem
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
            resetShouldSubmit={resetShouldSubmit}
            shouldSubmit={shouldSubmit}
        />
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    shouldSubmit: bool
};
