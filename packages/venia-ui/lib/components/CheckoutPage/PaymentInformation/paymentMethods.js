import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import Radio from '../../RadioGroup/radio';
import { mergeClasses } from '../../../classify';

import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import paymentMethodOperations from './paymentMethods.gql';
import defaultClasses from './paymentMethods.css';

import CreditCard from './creditCard';
import FreePaymentMethod from './PaymentMethods/FreePaymentMethod/freePaymentMethod';
import CheckmoMethod from './PaymentMethods/CheckmoMethod/checkmoMethod';

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
        return <div>Loading methods...</div>;
    }

    const COMPONENTS = {
        free: (
            <FreePaymentMethod
                onSubmit={onPaymentSuccess}
                setDoneEditing={setDoneEditing}
                shouldSubmit={reviewOrderButtonClicked}
            />
        ),
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
        ),
        checkmo: (
            <CheckmoMethod
                onSubmit={onPaymentSuccess}
                setDoneEditing={setDoneEditing}
                shouldSubmit={reviewOrderButtonClicked}
            />
        )
    };

    const radios = availablePaymentMethods.map(({ code, title }) => {
        // Always enable "free".
        const isSelected = selectedPaymentMethod === code || code === 'free';
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
