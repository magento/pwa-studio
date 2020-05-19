import React from 'react';

import { useFree } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useFree';

const Free = props => {
    const { onSuccess, shouldSubmit } = props;

    useFree({ onSuccess, shouldSubmit });

    return <div>No Payment Needed</div>;
};

export default Free;
