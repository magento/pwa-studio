import React from 'react';
import { Form } from 'informed';

import PaymentInformation from './paymentInformation';

const PaymentInformationFormWrapper = props => {
    return (
        <Form>
            <PaymentInformation {...props} />
        </Form>
    );
};

export default PaymentInformationFormWrapper;
