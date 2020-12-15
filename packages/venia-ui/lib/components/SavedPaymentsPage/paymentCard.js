import React from 'react';
import { shape, string } from 'prop-types';

import paymentCardMapper from './savedPaymentTypes';

const PaymentCard = props => {
    const PaymentComponent = paymentCardMapper[props.payment_method_code];

    return <PaymentComponent {...props} />;
};

export default PaymentCard;

PaymentCard.propTypes = {
    details: shape({
        expirationDate: string,
        maskedCC: string,
        type: string
    }),
    payment_method_code: string.isRequired
};
