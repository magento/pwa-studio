import React from 'react';
import { shape, string, bool } from 'prop-types';
import { RadioGroup } from 'informed';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import PaypalPaymentMethod from './paypalPaymentMethod';
import { mergeClasses } from '../../../classify';

import paymentMethodsOperations from './paymentMethods.gql';

import defaultClasses from './paymentMethods.css';

const PaymentMethods = props => {
    const {
        shouldRequestPaymentNonce,
        selectedPaymentMethod,
        classes: propClasses
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    usePaymentMethods({
        operations: paymentMethodsOperations
    });

    return (
        <RadioGroup field="selectedPaymentMethod">
            <div className={classes.root}>
                <div className={classes.payment_method}>
                    <Radio
                        key={'creditCard'}
                        label={'Credit Card'}
                        value={'creditCard'}
                        classes={{
                            label: classes.radio_label
                        }}
                        checked={selectedPaymentMethod === 'creditCard'}
                    />
                    <CreditCardPaymentMethod
                        isHidden={selectedPaymentMethod !== 'creditCard'}
                        shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                        brainTreeDropinContainerId={
                            'checkout-page-braintree-dropin-container'
                        }
                    />
                </div>
                <div className={classes.payment_method}>
                    <Radio
                        key={'paypal'}
                        label={'Paypal'}
                        value={'paypal'}
                        classes={{
                            label: classes.radio_label
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

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    shouldRequestPaymentNonce: bool,
    selectedPaymentMethod: string
};
