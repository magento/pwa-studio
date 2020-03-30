import React from 'react';
import { RadioGroup } from 'informed';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import PaypalPaymentMethod from './paypalPaymentMethod';

import defaultClasses from './paymentMethods.css';

const PaymentMethods = props => {
    const {
        shouldRequestPaymentNonce,
        onPaymentSuccess,
        setSelectedPaymentMethod,
        selectedPaymentMethod
    } = props;

    usePaymentMethods({
        selectedPaymentMethod,
        setSelectedPaymentMethod
    });

    return (
        <RadioGroup field="paymentMethods">
            <div className={defaultClasses.root}>
                <div className={defaultClasses.payment_method}>
                    <Radio
                        key={'creditCard'}
                        label={'Credit Card'}
                        value={'creditCard'}
                        classes={{
                            label: defaultClasses.radio_label
                        }}
                        checked={selectedPaymentMethod === 'creditCard'}
                    />
                    <CreditCardPaymentMethod
                        isHidden={selectedPaymentMethod !== 'creditCard'}
                        shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                        onPaymentSuccess={onPaymentSuccess}
                    />
                </div>
                <div className={defaultClasses.payment_method}>
                    <Radio
                        key={'paypal'}
                        label={'Paypal'}
                        value={'paypal'}
                        classes={{
                            label: defaultClasses.radio_label
                        }}
                        checked={selectedPaymentMethod === 'paypal'}
                    />
                    <PaypalPaymentMethod
                        isHidden={selectedPaymentMethod !== 'paypal'}
                    />
                </div>
            </div>
        </RadioGroup>
    );
};

export default PaymentMethods;
