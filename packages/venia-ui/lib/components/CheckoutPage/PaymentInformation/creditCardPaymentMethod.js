import React, { Fragment } from 'react';
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
        brainTreeDropinContainerId
    } = props;

    const classes = mergeClasses(defaultClasses, propClasses);

    const {
        onPaymentError,
        onPaymentSuccess,
        onPaymentReady,
        isBillingAddressSame,
        countries,
        isDropinLoading
    } = useCreditCard({
        onSuccess,
        onReady,
        isHidden,
        operations: creditCardPaymentOperations
    });

    const dropinClassName = isDropinLoading
        ? classes.dropin_hidden
        : classes.dropin_root;

    const billingAddressFields = !isBillingAddressSame ? (
        <div className={classes.billing_address_fields_root}>
            <div className={classes.first_name}>
                {
                    /**
                     * TODO: Should provide classes to fields.
                     */
                }
                <Field label="First Name">
                    <TextInput field="firstName" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.last_name}>
                <Field label="Last Name">
                    <TextInput field="lastName" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.country}>
                {/**
                 * TODO Will be converted to Country component once
                 * PWA-244 is merged.
                 */}
                <Field label="Country">
                    <TextInput field="country" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.street1}>
                <Field label="Street Address">
                    <TextInput field="street1" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.street2}>
                <Field label="Street Address 2">
                    <TextInput field="street2" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.city}>
                <Field label="City">
                    <TextInput field="city" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.state}>
                {/**
                 * TODO Will be converted to Region component once
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
            <div className={classes.postal_code}>
                <Field label="ZIP / Postal Code">
                    <TextInput field="postalCode" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.phone_number}>
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
    onDropinReady: func
};

export default CreditCardPaymentInformation;
