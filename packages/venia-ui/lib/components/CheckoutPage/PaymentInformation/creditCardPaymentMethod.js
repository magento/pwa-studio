import React, { useMemo } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';

import combine from '../../../util/combineValidators';
import {
    hasLengthExactly,
    isRequired,
    validateRegionCode
} from '../../../util/formValidators';
import Country from '../../Country';
import Region from '../../Region';
import Checkbox from '../../Checkbox';
import Field from '../../Field';
import TextInput from '../../TextInput';
import BrainTreeDropin from './brainTreeDropIn';
import LoadingIndicator from '../../LoadingIndicator';
import { mergeClasses } from '../../../classify';

import creditCardPaymentOperations from './creditCardPaymentMethod.gql';

import defaultClasses from './creditCardPaymentMethod.css';

const STEP_DESCRIPTIONS = [
    /**
     * This is because step numbers start from 1
     * but array indexes start from 0. Hence setting
     * index 0 to `null`.
     */
    null,
    'Submitting Billing Address',
    'Submitting Billing Address',
    'Submitting Payment Information',
    'Submitting Payment Information',
    'Submitting Payment Information',
    'Submitting Payment Information'
];

const CreditCardPaymentInformation = props => {
    const {
        classes: propClasses,
        updateButtonClicked,
        onPaymentSuccess: onSuccess,
        onDropinReady: onReady,
        brainTreeDropinContainerId,
        onPaymentError: onError,
        resetUpdateButtonClicked
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useCreditCard({
        onSuccess,
        onReady,
        onError,
        updateButtonClicked,
        resetUpdateButtonClicked,
        ...creditCardPaymentOperations
    });
    const {
        shouldRequestPaymentNonce,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading,
        errors,
        /**
         * `stepNumber` depicts the state of the process flow in credit card
         * payment flow.
         *
         * `0` No call made yet
         * `1` Billing address mutation intiated
         * `2` Billing address mutation completed
         * `3` Braintree nonce requsted
         * `4` Braintree nonce received
         * `5` Payment information mutation intiated
         * `6` Payment information mutation completed
         * `7` All mutations done
         */
        stepNumber,
        initialValues
    } = talonProps;

    const isLoading = isDropinLoading || (stepNumber >= 1 && stepNumber <= 6);

    const creditCardComponentClassName = isLoading
        ? classes.credit_card_root_hidden
        : classes.credit_card_root;

    /**
     * Instead of defining classes={root: classes.FIELD_NAME}
     * we are using useMemo to only do it once (hopefully).
     */
    const fieldClasses = useMemo(() => {
        return [
            'first_name',
            'last_name',
            'country',
            'street1',
            'street2',
            'city',
            'state',
            'postal_code',
            'phone_number'
        ].reduce((acc, fieldName) => {
            acc[fieldName] = { root: classes[fieldName] };

            return acc;
        }, {});
    }, [classes]);

    const billingAddressFields = !isBillingAddressSame ? (
        <div
            id="billingAddressFields"
            className={classes.billing_address_fields_root}
        >
            <Field classes={fieldClasses.first_name} label="First Name">
                <TextInput
                    field="firstName"
                    validate={isRequired}
                    initialValue={initialValues.firstName}
                />
            </Field>
            <Field classes={fieldClasses.last_name} label="Last Name">
                <TextInput
                    field="lastName"
                    validate={isRequired}
                    initialValue={initialValues.lastName}
                />
            </Field>
            <Country
                classes={fieldClasses.country}
                validate={isRequired}
                initialValue={initialValues.country || 'US'}
            />
            <Field classes={fieldClasses.street1} label="Street Address">
                <TextInput
                    field="street1"
                    validate={isRequired}
                    initialValue={initialValues.street1}
                />
            </Field>
            <Field classes={fieldClasses.street2} label="Street Address 2">
                <TextInput
                    field="street2"
                    initialValue={initialValues.street2}
                />
            </Field>
            <Field classes={fieldClasses.city} label="City">
                <TextInput
                    field="city"
                    validate={isRequired}
                    initialValue={initialValues.city}
                />
            </Field>
            <Region
                field="state"
                classes={fieldClasses.state}
                initialValue={initialValues.state}
                validate={combine([
                    isRequired,
                    [hasLengthExactly, 2],
                    [validateRegionCode, countries]
                ])}
            />
            <Field classes={fieldClasses.postal_code} label="ZIP / Postal Code">
                <TextInput
                    field="postalCode"
                    validate={isRequired}
                    initialValue={initialValues.postalCode}
                />
            </Field>
            <Field classes={fieldClasses.phone_number} label="Phone Number">
                <TextInput
                    field="phoneNumber"
                    validate={isRequired}
                    initialValue={initialValues.phoneNumber}
                />
            </Field>
        </div>
    ) : null;

    const errorMessage = useMemo(() => {
        if (errors.length) {
            return (
                <div className={classes.errors_container}>
                    {errors.map(error => (
                        <span className={classes.error} key={error}>
                            {error}
                        </span>
                    ))}
                </div>
            );
        } else {
            return null;
        }
    }, [errors, classes.error, classes.errors_container]);

    const loadingIndicator = isLoading ? (
        <LoadingIndicator>
            {STEP_DESCRIPTIONS[stepNumber] || 'Loading Payment'}
        </LoadingIndicator>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={creditCardComponentClassName}>
                <div className={classes.dropin_root}>
                    <BrainTreeDropin
                        onError={onPaymentError}
                        onReady={onPaymentReady}
                        onSuccess={onPaymentSuccess}
                        shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                        containerId={brainTreeDropinContainerId}
                    />
                </div>
                <div className={classes.address_check}>
                    <Checkbox
                        field="isBillingAddressSame"
                        label="Billing address same as shipping address"
                        initialValue={initialValues.isBillingAddressSame}
                    />
                </div>
                {billingAddressFields}
                {errorMessage}
            </div>
            {loadingIndicator}
        </div>
    );
};

export default CreditCardPaymentInformation;

CreditCardPaymentInformation.propTypes = {
    classes: shape({
        root: string,
        dropin_root: string,
        billing_address_fields_root: string,
        first_name: string,
        last_name: string,
        city: string,
        state: string,
        postal_code: string,
        phone_number: string,
        country: string,
        street1: string,
        street2: string,
        address_check: string,
        credit_card_root: string,
        credit_card_root_hidden: string
    }),
    updateButtonClicked: bool.isRequired,
    onPaymentSuccess: func,
    brainTreeDropinContainerId: string.isRequired,
    onDropinReady: func,
    onPaymentError: func,
    resetUpdateButtonClicked: func.isRequired
};
