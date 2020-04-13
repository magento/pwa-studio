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

const CreditCardPaymentInformation = props => {
    const {
        classes: propClasses,
        updateButtonClicked,
        isHidden,
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
        isHidden,
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
        billingAddressMutationCalled,
        billingAddressMutationLoading,
        ccMutationCalled,
        ccMutationLoading
    } = talonProps;

    /**
     * Show only if the billing address mutation is not called or
     * if it is called but there were errors.
     *
     * This is to avoid weird UI issues. Mutations are taking 3-4 seconds
     * and the UI stays stagnant till both the mutations are done.
     *
     * First we have to submit the billing address which takes 3-4 seconds
     * and then submit the payment nonce which takes another 3-4 seconds.
     * So for 6-8 seconds the component stays stagnant which is not a good UI.
     * We can not use conditional rendering to remove the components, because
     * if there was an error in either of the calls, instead of loading the old
     * component we will be unmounting and re mounting it. That is not an intended
     * model. To avoid all these things, I am using css classes to hide the component.
     */

    const billingAddressMutationInFlight =
        billingAddressMutationCalled && billingAddressMutationLoading;

    const ccMutationInFlight = ccMutationCalled && ccMutationLoading;

    const isLoading =
        isDropinLoading || billingAddressMutationInFlight || ccMutationInFlight;

    const creditCardComponentClassName = !isLoading
        ? classes.credit_card_root
        : classes.credit_card_root_hidden;

    const dropInClassName = isLoading
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
            <Country classes={fieldClasses.country} validate={isRequired} />
            <Field classes={fieldClasses.street1} label="Street Address">
                <TextInput field="street1" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.street2} label="Street Address 2">
                <TextInput field="street2" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.city} label="City">
                <TextInput field="city" validate={isRequired} />
            </Field>
            <Region
                field="state"
                classes={fieldClasses.state}
                validate={combine([
                    isRequired,
                    [hasLengthExactly, 2],
                    [validateRegionCode, countries]
                ])}
            />
            <Field classes={fieldClasses.postal_code} label="ZIP / Postal Code">
                <TextInput field="postalCode" validate={isRequired} />
            </Field>
            <Field classes={fieldClasses.phone_number} label="Phone Number">
                <TextInput field="phoneNumber" validate={isRequired} />
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
        <LoadingIndicator>{`Loading Payment`}</LoadingIndicator>
    ) : null;

    return !isHidden ? (
        <div className={classes.root}>
            <div className={creditCardComponentClassName}>
                <div className={dropInClassName}>
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
                    />
                </div>
                {billingAddressFields}
                {errorMessage}
            </div>
            {loadingIndicator}
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
        address_check: string,
        credit_card_root: string,
        credit_card_root_hidden: string
    }),
    updateButtonClicked: bool.isRequired,
    isHidden: bool.isRequired,
    onPaymentSuccess: func,
    brainTreeDropinContainerId: string.isRequired,
    onDropinReady: func,
    onPaymentError: func,
    resetUpdateButtonClicked: func.isRequired
};
