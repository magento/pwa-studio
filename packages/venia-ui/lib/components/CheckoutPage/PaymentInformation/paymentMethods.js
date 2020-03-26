import React from 'react';
import { RadioGroup } from 'informed';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/usePaymentMethods';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import PaypalPaymentMethod from './paypalPaymentMethod';

import defaultClasses from './paymentMethods.css';

const PaymentMethods = () => {
    const { selectedPaymentMethod } = usePaymentMethods();

    return (
        <RadioGroup field="paymentMethods">
            <Radio
                key={'creditCard'}
                label={'Credit Card'}
                value={'creditCard'}
                classes={{
                    label: defaultClasses.radio_label
                }}
            />
            <CreditCardPaymentMethod
                isHidden={selectedPaymentMethod !== 'creditCard'}
            />
            <Radio
                key={'paypal'}
                label={'Paypal'}
                value={'paypal'}
                classes={{
                    label: defaultClasses.radio_label
                }}
            />
            <PaypalPaymentMethod
                isHidden={selectedPaymentMethod !== 'paypal'}
            />
        </RadioGroup>
    );
};

export default PaymentMethods;
