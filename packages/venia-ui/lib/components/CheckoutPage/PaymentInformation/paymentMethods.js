import React from 'react';
import { shape, string, bool, func } from 'prop-types';
import { RadioGroup } from 'informed';

import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';

import { mergeClasses } from '../../../classify';
import Radio from '../../RadioGroup/radio';
import paymentMethodOperations from './paymentMethods.gql';
import defaultClasses from './paymentMethods.css';
import payments from './paymentMethodCollection';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        onPaymentError,
        onPaymentSuccess,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({
        ...paymentMethodOperations
    });

    const {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        initialSelectedMethod,
        isLoading
    } = talonProps;

    if (isLoading) {
        return null;
    }

    const radios = availablePaymentMethods
        .map(({ code, title }) => {
            // If we don't have an implementation for a method type, ignore it.
            if (!Object.keys(payments).includes(code)) {
                return;
            }

            const isSelected = currentSelectedPaymentMethod === code;
            const PaymentMethodComponent = payments[code];
            const renderedComponent = isSelected ? (
                <PaymentMethodComponent
                    onPaymentSuccess={onPaymentSuccess}
                    onPaymentError={onPaymentError}
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={shouldSubmit}
                />
            ) : null;

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
                    {renderedComponent}
                </div>
            );
        })
        .filter(paymentMethod => !!paymentMethod);

    const noPaymentMethodMessage = !radios.length ? (
        <span className={classes.no_payment_method}>
            {formatMessage({
                id: 'checkoutPage.noPaymentMethodAvailable',
                defaultMessage: 'No payment method available.'
            })}
        </span>
    ) : null;

    return (
        <div className={classes.root}>
            <RadioGroup
                field="selectedPaymentMethod"
                initialValue={initialSelectedMethod}
            >
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
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
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
