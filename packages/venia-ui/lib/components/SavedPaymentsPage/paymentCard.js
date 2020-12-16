import React from 'react';
import { shape, string } from 'prop-types';

import paymentCardMapper from './savedPaymentTypes';

const PaymentCard = props => {
    const PaymentComponent = paymentCardMapper[props.payment_method_code];

    if (!PaymentComponent) {
        /**
         * Will be handled in https://jira.corp.magento.com/browse/PWA-1202
         */
    }

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
