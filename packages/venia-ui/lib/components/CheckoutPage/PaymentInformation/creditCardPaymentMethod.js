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
        onPaymentSuccess: onSuccess
    } = props;

    const {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        updateBillingAddress,
        updateIsBillingAddressSame,
        isDropinLoading
    } = useCreditCard({
        onSuccess,
        operations: creditCardPaymentOperations
    });

    const dropinClassName = isDropinLoading
        ? defaultClasses.dropinHidden
        : defaultClasses.dropinRoot;

    const billingAddressFields = !isBillingAddressSame ? (
        <div className={defaultClasses.billing_address_fields_root}>
            <div className={defaultClasses.firstName}>
                <Field label="First Name">
                    <TextInput
                        id={defaultClasses.firstName}
                        field="firstName"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.lastName}>
                <Field label="Last Name">
                    <TextInput
                        id={defaultClasses.lastName}
                        field="lastName"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.street1}>
                <Field label="Street Address">
                    <TextInput
                        id={defaultClasses.street1}
                        field="street1"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.street2}>
                <Field label="Street Address 2">
                    <TextInput
                        id={defaultClasses.street2}
                        field="street2"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.city}>
                <Field label="City">
                    <TextInput
                        id={defaultClasses.city}
                        field="city"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.regionCode}>
                <Field label="State">
                    <TextInput
                        id={defaultClasses.regionCode}
                        field="state"
                        onBlur={updateBillingAddress}
                        validate={combine([
                            isRequired,
                            [hasLengthExactly, 2],
                            [validateRegionCode, countries]
                        ])}
                    />
                </Field>
            </div>
            <div className={defaultClasses.postCode}>
                <Field label="ZIP / Postal Code">
                    <TextInput
                        id={defaultClasses.postCode}
                        field="postalCode"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.phoneNumber}>
                <Field label="Phone Number">
                    <TextInput
                        id={defaultClasses.phoneNumber}
                        field="phoneNumber"
                        onBlur={updateBillingAddress}
                        validate={isRequired}
                    />
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
                    onChange={updateIsBillingAddressSame}
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
                />
            </div>
            {billingAddressSection}
        </div>
    ) : null;
};

export default CreditCardPaymentInformation;
