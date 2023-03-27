import React from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';
import { useAddressForm } from '@magento/peregrine/lib/talons/Checkout/useAddressForm';

import { useStyle } from '../../classify';
import combine from '../../util/combineValidators';
import { hasLengthExactly, isRequired, validateRegionCode } from '../../util/formValidators';
import Button from '../Button';
import Field from '../Field';
import TextInput from '../TextInput';
import defaultClasses from './addressForm.module.css';
import { gql } from '@apollo/client';

const fields = ['city', 'email', 'firstname', 'lastname', 'postcode', 'region_code', 'street', 'telephone'];

const AddressForm = props => {
    const { countries, isSubmitting, onCancel, onSubmit } = props;

    const talonProps = useAddressForm({
        countries,
        fields,
        onCancel,
        onSubmit
    });

    const { error, handleCancel, handleSubmit, initialValues, isSignedIn } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    // hide email field if user is signed in; cart already has address
    const emailField = !isSignedIn ? (
        <div className={classes.email}>
            <Field id={classes.email} label="Email">
                <TextInput id={classes.email} field="email" validate={isRequired} />
            </Field>
        </div>
    ) : null;

    const headingText = 'Shipping Address';
    const submitText = 'Use Address';
    const cancelText = 'Cancel';

    return (
        <Form className={classes.root} initialValues={initialValues} onSubmit={handleSubmit}>
            <div className={classes.body}>
                <h2 className={classes.heading}>{headingText}</h2>
                <div className={classes.validationMessage}>{error && error.toString()}</div>
                <div className={classes.firstname}>
                    <Field id={classes.firstname} label="First Name">
                        <TextInput id={classes.firstname} field="firstname" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id={classes.lastname} label="Last Name">
                        <TextInput id={classes.lastname} field="lastname" validate={isRequired} />
                    </Field>
                </div>
                {emailField}
                <div className={classes.street0}>
                    <Field id={classes.street0} label="Street">
                        <TextInput id={classes.street0} field="street[0]" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.city}>
                    <Field id={classes.city} label="City">
                        <TextInput id={classes.city} field="city" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.region_code}>
                    <Field id={classes.region_code} label="State">
                        <TextInput
                            id={classes.region_code}
                            field="region_code"
                            validate={combine([isRequired, [hasLengthExactly, 2], [validateRegionCode, countries]])}
                        />
                    </Field>
                </div>
                <div className={classes.postcode}>
                    <Field id={classes.postcode} label="ZIP">
                        <TextInput id={classes.postcode} field="postcode" validate={isRequired} />
                    </Field>
                </div>
                <div className={classes.telephone}>
                    <Field id={classes.telephone} label="Phone">
                        <TextInput id={classes.telephone} field="telephone" validate={isRequired} />
                    </Field>
                </div>
            </div>
            <div className={classes.footer}>
                <Button type="submit" priority="high" disabled={isSubmitting}>
                    {submitText}
                </Button>
                <Button onClick={handleCancel} priority="low">
                    {cancelText}
                </Button>
            </div>
        </Form>
    );
};

AddressForm.propTypes = {
    onCancel: func.isRequired,
    classes: shape({
        body: string,
        button: string,
        city: string,
        email: string,
        firstname: string,
        footer: string,
        heading: string,
        lastname: string,
        postcode: string,
        root: string,
        region_code: string,
        street0: string,
        telephone: string,
        validation: string
    }),
    countries: array,
    isSubmitting: bool,
    onSubmit: func.isRequired
};

export default AddressForm;
