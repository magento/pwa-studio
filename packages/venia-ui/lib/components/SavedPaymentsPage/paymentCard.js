import React from 'react';

import CreditCard from './creditCard';

const paymentCardMapper = {
    braintree: CreditCard
};

const PaymentCard = props => {
    const PaymentComponent = paymentCardMapper[props.payment_method_code];

    return <PaymentComponent {...props} />;
};

export default PaymentCard;
