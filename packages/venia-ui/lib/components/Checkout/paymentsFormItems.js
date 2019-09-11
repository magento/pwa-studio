import React, {
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';
import { useFormState } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import BraintreeDropin from './braintreeDropin';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Field from '../Field';
import TextInput from '../TextInput';
import {
    isRequired,
    hasLengthExactly,
    validateRegionCode,
    validateEmail
} from '../../util/formValidators';
import combine from '../../util/combineValidators';

/**
 * This component is meant to be nested within an `informed` form. It utilizes
 * form state to do conditional rendering and submission.
 */
const PaymentsFormItems = props => {
    const [isReady, setIsReady] = useState(false);

    const {
        cancel,
        classes,
        countries,
        isSubmitting,
        setIsSubmitting,
        submit: submitPaymentData
    } = props;

    // Currently form state toggles dirty from false to true because of how
    // informed is implemented. This effectively causes this child components
    // to re-render multiple times. Keep tabs on the following issue:
    //   https://github.com/joepuzzo/informed/issues/138
    // If they resolve it or we move away from informed we can probably get some
    // extra performance.
    const formState = useFormState();
    const anchorRef = useRef(null);
    const addressDiffers = formState.values.addresses_same === false;

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
            <div className={classes.email}>
                <Field label="Email">
                    <TextInput
                        id={classes.email}
                        field="email"
                        validate={combine([isRequired, validateEmail])}
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

    const handleError = useCallback(() => {
        setIsSubmitting(false);
    }, [setIsSubmitting]);

    // The success callback. Unfortunately since form state is created first and
    // then modified when using initialValues any component who uses this
    // callback will be rendered multiple times on first render. See above
    // comments for more info.
    const handleSuccess = useCallback(
        value => {
            setIsSubmitting(false);
            const sameAsShippingAddress = formState.values['addresses_same'];
            let billingAddress;
            if (!sameAsShippingAddress) {
                billingAddress = {
                    city: formState.values['city'],
                    email: formState.values['email'],
                    firstname: formState.values['firstname'],
                    lastname: formState.values['lastname'],
                    postcode: formState.values['postcode'],
                    region_code: formState.values['region_code'],
                    street: formState.values['street'],
                    telephone: formState.values['telephone']
                };
            } else {
                billingAddress = {
                    sameAsShippingAddress
                };
            }
            submitPaymentData({
                billingAddress,
                paymentMethod: {
                    code: 'braintree',
                    data: value
                }
            });
        },
        [formState.values, setIsSubmitting, submitPaymentData]
    );

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

    return (
        <Fragment>
            <div className={classes.body}>
                <h2 className={classes.heading}>Billing Information</h2>
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
                <Button className={classes.button} onClick={cancel}>
                    Cancel
                </Button>
                <Button
                    className={classes.button}
                    priority="high"
                    type="submit"
                    disabled={!isReady || isSubmitting}
                >
                    Use Card
                </Button>
            </div>
        </Fragment>
    );
};

PaymentsFormItems.propTypes = {
    cancel: func.isRequired,
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
    submit: func.isRequired
};

export default PaymentsFormItems;
