import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import { mergeClasses } from '../../../classify';

import paymentMethodsOperations from './paymentMethods.gql';

import defaultClasses from './paymentMethods.css';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        shouldRequestPaymentNonce,
        selectedPaymentMethod,
        onPaymentSuccess
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    usePaymentMethods(paymentMethodsOperations);

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
                        onPaymentSuccess={onPaymentSuccess}
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
    selectedPaymentMethod: string,
    onPaymentSuccess: func
};
