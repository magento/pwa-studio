import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import { mergeClasses } from '../../../classify';
import Radio from '../../RadioGroup/radio';
import CreditCard from './creditCard';
import paymentMethodOperations from './paymentMethods.gql';
import defaultClasses from './paymentMethods.css';

const ALLOWED_PAYMENT_METHODS = ['braintree'];

const PaymentMethods = props => {
    const {
        classes: propClasses,
        reviewOrderButtonClicked,
        selectedPaymentMethod,
        setDoneEditing,
        onPaymentSuccess,
        onPaymentError,
        resetReviewOrderButtonClicked
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({
        ...paymentMethodOperations
    });

    const {
        availablePaymentMethods,
        initialSelectedMethod,
        isLoading
    } = talonProps;

    if (isLoading) {
        return null;
    }

    const COMPONENTS = {
        braintree: (
            <CreditCard
                brainTreeDropinContainerId={
                    'checkout-page-braintree-dropin-container'
                }
                onPaymentSuccess={onPaymentSuccess}
                onPaymentError={onPaymentError}
                resetShouldSubmit={resetReviewOrderButtonClicked}
                setDoneEditing={setDoneEditing}
                shouldSubmit={reviewOrderButtonClicked}
            />
        )
    };

    const radios = availablePaymentMethods.map(({ code, title }) => {
        // Customize UI of your selectable payment methods.
        if (!ALLOWED_PAYMENT_METHODS.includes(code)) {
            return;
        }

        const isSelected = selectedPaymentMethod === code;
        const component = isSelected ? COMPONENTS[code] : null;

        return (
            <div key={code} className={classes.payment_method}>
                <Radio
                    label={title}
                    value={code}
                    classes={{
                        label: classes.radio_label
                    }}
                    checked={isSelected}
                />
                {component}
            </div>
        );
    });

    return (
        <div className={classes.root}>
            <RadioGroup
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
        </div>
    );
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
