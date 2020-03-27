import React from 'react';

import defaultClasses from './paypalPaymentMethod.css';

const PaypalPaymentMethod = ({ isHidden }) => {
    const paypalComponent = isHidden ? null : (
        <div className={defaultClasses.root}>Coming soon...</div>
    );

    return paypalComponent;
};

export default PaypalPaymentMethod;
