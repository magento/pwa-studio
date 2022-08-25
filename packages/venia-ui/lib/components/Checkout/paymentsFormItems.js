import React, { Fragment, useEffect, useRef } from 'react';
import { array, bool, func, shape, string } from 'prop-types';
import { usePaymentsFormItems } from '@magento/peregrine/lib/talons/Checkout/usePaymentsFormItems';

import combine from '../../util/combineValidators';
import {
    hasLengthExactly,
    isRequired,
    validateRegionCode
} from '../../util/formValidators';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import TextInput from '../TextInput';
import BraintreeDropin from './braintreeDropin';

/**
 * This component is meant to be nested within an `informed` form. It utilizes
 * form state to do conditional rendering and submission.
 */
const PaymentsFormItems = props => {
    const {
        classes,
        countries,
        isSubmitting,
        onCancel,
        onSubmit,
        setIsSubmitting
    } = props;

    const {
        addressDiffers,
        handleCancel,
        handleError,
        handleSuccess,
        isDisabled,
        setIsReady
    } = usePaymentsFormItems({
        isSubmitting,
        setIsSubmitting,
        onCancel,
        onSubmit
    });

    const anchorRef = useRef(null);

    // When the address checkbox is unchecked, additional fields are rendered.
    // This causes the form to grow, and potentially to overflow, so the new
    // fields may go unnoticed. To reveal them, we scroll them into view.
    useEffect(() => {
        if (addressDiffers) {
            const { current: element } = anchorRef;

            if (element instanceof HTMLElement) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [addressDiffers]);

    const billingAddressFields = addressDiffers ? (
        <Fragment>
            <div className={classes.firstname}>
                <Field label="First Name">
                    <TextInput
                        id={classes.firstname}
                        field="firstname"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.lastname}>
                <Field label="Last Name">
                    <TextInput
                        id={classes.lastname}
                        field="lastname"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.street0}>
                <Field label="Street">
                    <TextInput
                        id={classes.street0}
                        field="street[0]"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.city}>
                <Field label="City">
                    <TextInput
                        id={classes.city}
                        field="city"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.region_code}>
                <Field label="State">
                    <TextInput
                        id={classes.region_code}
                        field="region_code"
                        validate={combine([
                            isRequired,
                            [hasLengthExactly, 2],
                            [validateRegionCode, countries]
                        ])}
                    />
                </Field>
            </div>
            <div className={classes.postcode}>
                <Field label="ZIP">
                    <TextInput
                        id={classes.postcode}
                        field="postcode"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <div className={classes.telephone}>
                <Field label="Phone">
                    <TextInput
                        id={classes.telephone}
                        field="telephone"
                        validate={isRequired}
                    />
                </Field>
            </div>
            <span ref={anchorRef} />
        </Fragment>
    ) : null;

    const headingText = 'Billing Information';
    const submitButtonText = 'Use Card';
    const cancelButtonText = 'Cancel';

    return (
        <Fragment>
            <div className={classes.body}>
                <h2 className={classes.heading}>{headingText}</h2>
                <div className={classes.braintree}>
                    <BraintreeDropin
                        shouldRequestPaymentNonce={isSubmitting}
                        onError={handleError}
                        onSuccess={handleSuccess}
                        onReady={setIsReady}
                    />
                </div>
                <div className={classes.address_check}>
                    <Checkbox
                        field="addresses_same"
                        label="Billing address same as shipping address"
                    />
                </div>
                {billingAddressFields}
            </div>
            <div className={classes.footer}>
                <Button priority="high" type="submit" disabled={isDisabled}>
                    {submitButtonText}
                </Button>
                <Button onClick={handleCancel} priority="low">
                    {cancelButtonText}
                </Button>
            </div>
        </Fragment>
    );
};

PaymentsFormItems.propTypes = {
    onCancel: func.isRequired,
    classes: shape({
        address_check: string,
        body: string,
        button: string,
        braintree: string,
        firstname: string,
        lastname: string,
        telephone: string,
        city: string,
        footer: string,
        heading: string,
        postcode: string,
        region_code: string,
        street0: string
    }),
    countries: array,
    isSubmitting: bool,
    setIsSubmitting: func.isRequired,
    onSubmit: func.isRequired
};

export default PaymentsFormItems;
