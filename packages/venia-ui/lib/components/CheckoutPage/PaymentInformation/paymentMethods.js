import React from 'react';
import { RadioGroup } from 'informed';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/usePaymentMethods';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import PaypalPaymentMethod from './paypalPaymentMethod';

const PaymentMethods = () => {
    const { selectedPaymentMethod } = usePaymentMethods();

    const creditCard =
        selectedPaymentMethod === 'creditCard' ? (
            <CreditCardPaymentMethod />
        ) : null;

    const payPal =
        selectedPaymentMethod === 'paypal' ? <PaypalPaymentMethod /> : null;

    return (
        <RadioGroup field="paymentMethods">
            <Radio
                key={'creditCard'}
                label={'Credit Card'}
                value={'creditCard'}
            />
            {creditCard}
            <Radio key={'paypal'} label={'Paypal'} value={'paypal'} />
            {payPal}
        </RadioGroup>
    );
};

export default PaymentMethods;
