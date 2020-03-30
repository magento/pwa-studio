import React from 'react';

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
        addressesDiffer,
        countries,
        updateBillingAddress
    } = useCreditCard({
        onSuccess,
        operations: creditCardPaymentOperations
    });

    const billingAddressFields = !addressesDiffer ? (
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

    return !isHidden ? (
        <div className={defaultClasses.root}>
            <BrainTreeDropin
                onError={onPaymentError}
                onReady={onPaymentReady}
                onSuccess={onPaymentSuccess}
                shouldRequestPaymentNonce={shouldRequestPaymentNonce}
            />
            <div className={defaultClasses.addressCheck}>
                <Checkbox
                    field="isSameAsBillingAddress"
                    label="Billing address same as shipping address"
                />
            </div>
            {billingAddressFields}
        </div>
    ) : null;
};

export default CreditCardPaymentInformation;
