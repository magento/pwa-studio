import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import CreditCard from './creditCard';

import defaultClasses from './paymentCard.css';

const paymentCardMapper = {
    braintree: CreditCard
};

const PaymentCard = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const PaymentComponent = paymentCardMapper[props.payment_method_code];

    return <PaymentComponent {...props} classes={classes} />;
};

export default PaymentCard;
