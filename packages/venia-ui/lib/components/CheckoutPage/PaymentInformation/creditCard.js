import React, { useMemo, useCallback } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';

import { isRequired } from '../../../util/formValidators';
import Country from '../../Country';
import Region from '../../Region';
import Checkbox from '../../Checkbox';
import Field from '../../Field';
import TextInput from '../../TextInput';
import BrainTreeDropin from './brainTreeDropIn';
import LoadingIndicator from '../../LoadingIndicator';
import { mergeClasses } from '../../../classify';

import creditCardPaymentOperations from './creditCard.gql';

import defaultClasses from './creditCard.css';

const STEP_DESCRIPTIONS = [
    'Loading Payment',
    'Checking Credit Card Information',
    'Checking Credit Card Information',
    'Checking Credit Card Information',
    'Saved Credit Card Information Successfully'
];

const CreditCard = props => {
    const {
        classes: propClasses,
        onPaymentSuccess: onSuccess,
        onDropinReady: onReady,
        onPaymentError: onError,
        resetShouldSubmit,
        shouldSubmit
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useCreditCard({
        onSuccess,
        onReady,
        onError,
        shouldSubmit,
        resetShouldSubmit,
        ...creditCardPaymentOperations
    });

    const {
        shouldRequestPaymentNonce,
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        isLoading,
        errors,
        /**
         * `stepNumber` depicts the state of the process flow in credit card
         * payment flow.
         *
         * `0` No call made yet
         * `1` Billing address mutation intiated
         * `2` Braintree nonce requsted
         * `3` Payment information mutation intiated
         * `4` All mutations done
         */
        stepNumber,
        initialValues,
        shippingAddressCountry,
        shouldTeardownDropin,
        resetShouldTeardownDropin
    } = talonProps;

    const creditCardComponentClassName = isLoading
        ? classes.credit_card_root_hidden
        : classes.credit_card_root;

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

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

    /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     *
     * We write this function in `venia-ui` and not in the `peregrine` talon
     * because it references `isRequired` which is a `venia-ui` function.
     */
    const isFieldRequired = useCallback(
        value => {
            if (isBillingAddressSame) {
                /**
                 * Informed validator functions return `undefined` is
                 * validation is `true`
                 */
                return undefined;
            } else {
                return isRequired(value);
            }
        },
        [isBillingAddressSame]
    );

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
                        shouldTeardownDropin={shouldTeardownDropin}
                        resetShouldTeardownDropin={resetShouldTeardownDropin}
                    />
                </div>
                <div className={classes.address_check}>
                    <Checkbox
                        field="isBillingAddressSame"
                        label="Billing address same as shipping address"
                        initialValue={initialValues.isBillingAddressSame}
                    />
                </div>
                <div className={billingAddressFieldsClassName}>
                    <Field classes={fieldClasses.first_name} label="First Name">
                        <TextInput
                            field="firstName"
                            validate={isFieldRequired}
                            initialValue={initialValues.firstName}
                        />
                    </Field>
                    <Field classes={fieldClasses.last_name} label="Last Name">
                        <TextInput
                            field="lastName"
                            validate={isFieldRequired}
                            initialValue={initialValues.lastName}
                        />
                    </Field>
                    <Country
                        classes={fieldClasses.country}
                        validate={isFieldRequired}
                        initialValue={
                            /**
                             * If there is no initial value to start with
                             * use the country from shipping address.
                             */
                            initialValues.country || shippingAddressCountry
                        }
                    />
                    <Field
                        classes={fieldClasses.street1}
                        label="Street Address"
                    >
                        <TextInput
                            field="street1"
                            validate={isFieldRequired}
                            initialValue={initialValues.street1}
                        />
                    </Field>
                    <Field
                        classes={fieldClasses.street2}
                        label="Street Address 2"
                        optional={true}
                    >
                        <TextInput
                            field="street2"
                            initialValue={initialValues.street2}
                        />
                    </Field>
                    <Field classes={fieldClasses.city} label="City">
                        <TextInput
                            field="city"
                            validate={isFieldRequired}
                            initialValue={initialValues.city}
                        />
                    </Field>
                    <Region
                        field="state"
                        classes={fieldClasses.state}
                        initialValue={initialValues.state}
                        validate={isFieldRequired}
                    />
                    <Field
                        classes={fieldClasses.postal_code}
                        label="ZIP / Postal Code"
                    >
                        <TextInput
                            field="postalCode"
                            validate={isFieldRequired}
                            initialValue={initialValues.postalCode}
                        />
                    </Field>
                    <Field
                        classes={fieldClasses.phone_number}
                        label="Phone Number"
                    >
                        <TextInput
                            field="phoneNumber"
                            validate={isFieldRequired}
                            initialValue={initialValues.phoneNumber}
                        />
                    </Field>
                </div>
                {errorMessage}
            </div>
            {loadingIndicator}
        </div>
    );
};

export default CreditCard;

CreditCard.propTypes = {
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
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
