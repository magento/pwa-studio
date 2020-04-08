import React, { Fragment, useMemo } from 'react';
import { bool, func, shape, string } from 'prop-types';
import { useCreditCard } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/useCreditCard';

import combine from '../../../util/combineValidators';
import {
    hasLengthExactly,
    isRequired,
    validateRegionCode
} from '../../../util/formValidators';
import Checkbox from '../../Checkbox';
import Field from '../../Field';
import TextInput from '../../TextInput';
import BrainTreeDropin from './brainTreeDropIn';
import LoadingIndicator from '../../LoadingIndicator';
import { mergeClasses } from '../../../classify';

import creditCardPaymentOperations from './creditCardPaymentMethod.gql';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = props => {
    const {
        classes: propClasses,
        shouldRequestPaymentNonce,
        isHidden,
        onPaymentSuccess: onSuccess,
        onDropinReady: onReady,
        brainTreeDropinContainerId,
        onPaymentError: onError
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const talonProps = useCreditCard({
        onSuccess,
        onReady,
        onError,
        isHidden,
        ...creditCardPaymentOperations
    });
    const {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading
    } = talonProps;

    const dropinClassName = isDropinLoading
        ? classes.dropin_hidden
        : classes.dropin_root;

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
                <TextInput field="firstName" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.last_name} label="Last Name">
                <TextInput field="lastName" validate={isRequired} />
            </Field>
            {/**
             * TODO Will be converted to Country component once
             * PWA-244 is merged.
             */}
            <Field classes={fieldClasses.country} label="Country">
                <TextInput field="country" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.street1} label="Street Address">
                <TextInput field="street1" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.street2} label="Street Address 2">
                <TextInput field="street2" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.city} label="City">
                <TextInput field="city" validate={isRequired} />
            </Field>
            {/**
             * TODO Will be converted to Region component once
             * PWA-244 is merged.
             */}
            <Field classes={fieldClasses.state} label="State">
                <TextInput
                    field="state"
                    validate={combine([
                        isRequired,
                        [hasLengthExactly, 2],
                        [validateRegionCode, countries]
                    ])}
                />
            </Field>
            <Field classes={fieldClasses.postal_code} label="ZIP / Postal Code">
                <TextInput field="postalCode" validate={isRequired} />
            </Field>

            <Field classes={fieldClasses.phone_number} label="Phone Number">
                <TextInput field="phoneNumber" validate={isRequired} />
            </Field>
        </div>
    ) : null;

    const billingAddressSection = isDropinLoading ? (
        <LoadingIndicator>{`Loading Payment`}</LoadingIndicator>
    ) : (
        <Fragment>
            <div className={classes.address_check}>
                <Checkbox
                    field="isBillingAddressSame"
                    label="Billing address same as shipping address"
                />
            </div>
            {billingAddressFields}
        </Fragment>
    );

    return !isHidden ? (
        <div className={classes.root}>
            <div className={dropinClassName}>
                <BrainTreeDropin
                    onError={onPaymentError}
                    onReady={onPaymentReady}
                    onSuccess={onPaymentSuccess}
                    shouldRequestPaymentNonce={shouldRequestPaymentNonce}
                    containerId={brainTreeDropinContainerId}
                />
            </div>
            {billingAddressSection}
        </div>
    ) : null;
};

export default CreditCardPaymentInformation;

CreditCardPaymentInformation.propTypes = {
    classes: shape({
        root: string,
        dropin_root: string,
        dropin_hidden: string,
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
        address_check: string
    }),
    shouldRequestPaymentNonce: bool.isRequired,
    isHidden: bool.isRequired,
    onPaymentSuccess: func,
    brainTreeDropinContainerId: string.isRequired,
    onDropinReady: func,
    onPaymentError: func
};
