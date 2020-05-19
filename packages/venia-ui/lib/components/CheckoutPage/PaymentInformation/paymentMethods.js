import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import Radio from '../../RadioGroup/radio';
import CreditCard from './creditCard';
import { mergeClasses } from '../../../classify';

import defaultClasses from './paymentMethods.css';
import Free from './free';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        reviewOrderButtonClicked,
        selectedPaymentMethod,
        onPaymentSuccess,
        onPaymentError,
        resetReviewOrderButtonClicked,
        total
    } = props;

    const defaultPaymentMethod = total === 0 ? 'free' : 'braintree';

    const classes = mergeClasses(defaultClasses, propClasses);

    const creditCard =
        selectedPaymentMethod === 'braintree' ? (
            <CreditCard
                shouldSubmit={reviewOrderButtonClicked}
                brainTreeDropinContainerId={
                    'checkout-page-braintree-dropin-container'
                }
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetReviewOrderButtonClicked}
            />
        ) : null;

    const paymentMethods =
        selectedPaymentMethod === 'free' ? (
            <Free
                onSuccess={onPaymentSuccess}
                shouldSubmit={reviewOrderButtonClicked}
            />
        ) : (
            <RadioGroup
                field="selectedPaymentMethod"
                initialValue={defaultPaymentMethod}
            >
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
                    {creditCard}
                </div>
            </RadioGroup>
        );

    return <div className={classes.root}>{paymentMethods}</div>;
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    reviewOrderButtonClicked: bool,
    selectedPaymentMethod: string,
    onPaymentSuccess: func,
    onPaymentError: func,
    resetReviewOrderButtonClicked: func
};
