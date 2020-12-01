import React from 'react';

import paymentCardMapper from './savedPaymentTypes';

const PaymentCard = props => {
    const PaymentComponent = paymentCardMapper[props.payment_method_code];

    return <PaymentComponent {...props} />;
};

export default PaymentCard;
