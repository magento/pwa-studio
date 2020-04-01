import React, { Fragment } from 'react';

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

import creditCardPaymentOperations from './creditCardPaymentMethod.gql';

import defaultClasses from './creditCardPaymentMethod.css';

const CreditCardPaymentInformation = props => {
    const {
        shouldRequestPaymentNonce,
        isHidden,
        onPaymentSuccess: onSuccess,
        brainTreeDropinContainerId
    } = props;

    const {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading
    } = useCreditCard({
        onSuccess,
        isHidden,
        operations: creditCardPaymentOperations
    });

    const dropinClassName = isDropinLoading
        ? defaultClasses.dropinHidden
        : defaultClasses.dropinRoot;

    const billingAddressFields = !isBillingAddressSame ? (
        <div className={defaultClasses.billing_address_fields_root}>
            <div className={defaultClasses.firstName}>
                <Field label="First Name">
                    <TextInput field="firstName" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.lastName}>
                <Field label="Last Name">
                    <TextInput field="lastName" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.country}>
                {/**
                 * Will be converted to Country component once
                 * PWA-244 is merged.
                 */}
                <Field label="Country">
                    <TextInput field="country" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.street1}>
                <Field label="Street Address">
                    <TextInput field="street1" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.street2}>
                <Field label="Street Address 2">
                    <TextInput field="street2" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.city}>
                <Field label="City">
                    <TextInput field="city" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.state}>
                {/**
                 * Will be converted to Region component once
                 * PWA-244 is merged.
                 */}
                <Field label="State">
                    <TextInput
                        field="state"
                        validate={combine([
                            isRequired,
                            [hasLengthExactly, 2],
                            [validateRegionCode, countries]
                        ])}
                    />
                </Field>
            </div>
            <div className={defaultClasses.postalCode}>
                <Field label="ZIP / Postal Code">
                    <TextInput field="postalCode" validate={isRequired} />
                </Field>
            </div>
            <div className={defaultClasses.phoneNumber}>
                <Field label="Phone Number">
                    <TextInput field="phoneNumber" validate={isRequired} />
                </Field>
            </div>
        </div>
    ) : null;

    const billingAddressSection = isDropinLoading ? (
        <LoadingIndicator>{`Loading Payment`}</LoadingIndicator>
    ) : (
        <Fragment>
            <div className={defaultClasses.addressCheck}>
                <Checkbox
                    field="isBillingAddressSame"
                    label="Billing address same as shipping address"
                />
            </div>
            {billingAddressFields}
        </Fragment>
    );

    return !isHidden ? (
        <div className={defaultClasses.root}>
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
