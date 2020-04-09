import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import Radio from '../../RadioGroup/radio';
import CreditCardPaymentMethod from './creditCardPaymentMethod';
import { mergeClasses } from '../../../classify';

import defaultClasses from './paymentMethods.css';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        shouldRequestPaymentNonce,
        selectedPaymentMethod,
        onPaymentSuccess,
        onPaymentError
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <RadioGroup field="selectedPaymentMethod">
            <div className={classes.root}>
                <div className={classes.payment_method}>
                    <Radio
                        key={'braintree'}
                        label={'Credit Card'}
                        value={'braintree'}
                        classes={{
                            label: classes.radio_label
                        }}
                        checked={selectedPaymentMethod === 'braintree'}
                    />
                    <CreditCardPaymentMethod
                        isHidden={selectedPaymentMethod !== 'braintree'}
                        shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                        brainTreeDropinContainerId={
                            'checkout-page-braintree-dropin-container'
                        }
                        onPaymentSuccess={onPaymentSuccess}
                        onPaymentError={onPaymentError}
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
    onPaymentSuccess: func,
    onPaymentError: func
};
