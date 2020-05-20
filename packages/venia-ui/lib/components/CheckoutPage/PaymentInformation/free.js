import React from 'react';

import { useFree } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useFree';

import freeComponentOperations from './free.gql';

const Free = props => {
    const { onSuccess, shouldSubmit } = props;

    useFree({ onSuccess, shouldSubmit, ...freeComponentOperations });

    return <div>No Payment Needed</div>;
};

export default Free;
