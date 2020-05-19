import React, { Fragment } from 'react';

import { useFree } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useFree';

const Free = props => {
    const { onSuccess } = props;

    useFree({ onSuccess });

    return <Fragment />;
};

export default Free;
