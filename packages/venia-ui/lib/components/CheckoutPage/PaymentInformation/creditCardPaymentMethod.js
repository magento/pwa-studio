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
        onBlur
    } = useCreditCard({
        onSuccess,
        operations: creditCardPaymentOperations
    });

    const billingAddressFields = !addressesDiffer ? (
        <div className={defaultClasses.billing_address_fields_root}>
            <div className={defaultClasses.firstname}>
                <Field label="First Name">
                    <TextInput
                        id={defaultClasses.firstname}
                        field="firstname"
                        validate={isRequired}
                        onBlur={onBlur}
                    />
                </Field>
            </div>
            <div className={defaultClasses.lastname}>
                <Field label="Last Name">
                    <TextInput
                        id={defaultClasses.lastname}
                        field="lastname"
                        validate={isRequired}
                        onBlur={onBlur}
                    />
                </Field>
            </div>
            <div className={defaultClasses.street1}>
                <Field label="Street Address">
                    <TextInput
                        id={defaultClasses.street1}
                        field="street1"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.street2}>
                <Field label="Street Address 2">
                    <TextInput
                        id={defaultClasses.street2}
                        field="street2"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.city}>
                <Field label="City">
                    <TextInput
                        id={defaultClasses.city}
                        field="city"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.region_code}>
                <Field label="State">
                    <TextInput
                        id={defaultClasses.region_code}
                        field="region_code"
                        validate={combine([
                            isRequired,
                            [hasLengthExactly, 2],
                            [validateRegionCode, countries]
                        ])}
                    />
                </Field>
            </div>
            <div className={defaultClasses.postcode}>
                <Field label="ZIP / Postal Code">
                    <TextInput
                        id={defaultClasses.postcode}
                        field="postcode"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={defaultClasses.telephone}>
                <Field label="Phone Number">
                    <TextInput
                        id={defaultClasses.telephone}
                        field="telephone"
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
            <div className={defaultClasses.address_check}>
                <Checkbox
                    field="addresses_same"
                    label="Billing address same as shipping address"
                />
            </div>
            {billingAddressFields}
        </div>
    ) : null;
};

export default CreditCardPaymentInformation;
