import React from 'react';
import { string } from 'prop-types';

import paymentCardMapper from './savedPaymentTypes';

const PaymentCard = props => {
    const PaymentComponent = paymentCardMapper[props.payment_method_code];

    return <PaymentComponent {...props} />;
};

export default PaymentCard;

PaymentCard.propTypes = {
    details: string,
    payment_method_code: string.isRequired
};
