import React, { useCallback, useMemo } from 'react';
import { Form } from 'informed';
import { array, bool, func, object, shape, string } from 'prop-types';

import { mergeClasses } from 'src/classify';
import Button from 'src/components/Button';
import defaultClasses from './addressForm.css';
import {
    validateEmail,
    isRequired,
    hasLengthExactly,
    validateRegionCode
} from 'src/util/formValidators';
import combine from 'src/util/combineValidators';
import TextInput from 'src/components/TextInput';
import Field from 'src/components/Field';

const fields = [
    'city',
    'email',
    'firstname',
    'lastname',
    'postcode',
    'region_code',
    'street',
    'telephone'
];

const AddressForm = props => {
    const {
        cancel,
        countries,
        isAddressIncorrect,
        incorrectAddressMessage,
        initialValues,
        submit,
        submitting
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const validationMessage = isAddressIncorrect
        ? incorrectAddressMessage
        : null;

    const values = useMemo(
        () =>
            fields.reduce((acc, key) => {
                acc[key] = initialValues[key];
                return acc;
            }, {}),
        [fields, initialValues]
    );

    const handleCancel = useCallback(() => {
        cancel();
    }, [cancel]);

    const handleSubmit = useCallback(
        values => {
            submit(values);
        },
        [submit]
    );

    return (
        <Form
            className={classes.root}
            initialValues={values}
            onSubmit={handleSubmit}
        >
            <div className={classes.body}>
                <h2 className={classes.heading}>Shipping Address</h2>
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
                <div className={classes.postcode}>
                    <Field label="ZIP">
                        <TextInput
                            id={classes.postcode}
                            field="postcode"
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
                <div className={classes.telephone}>
                    <Field label="Phone">
                        <TextInput
                            id={classes.telephone}
                            field="telephone"
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
                <div className={classes.validation}>{validationMessage}</div>
            </div>
            <div className={classes.footer}>
                <Button className={classes.button} onClick={handleCancel}>
                    Cancel
                </Button>
                <Button
                    className={classes.button}
                    type="submit"
                    priority="high"
                    disabled={submitting}
                >
                    Use Address
                </Button>
            </div>
        </Form>
    );
};

AddressForm.propTypes = {
    cancel: func.isRequired,
    classes: shape({
        body: string,
        button: string,
        city: string,
        email: string,
        firstname: string,
        footer: string,
        lastname: string,
        postcode: string,
        region_code: string,
        street0: string,
        telephone: string,
        textInput: string,
        validation: string
    }),
    countries: array,
    incorrectAddressMessage: string,
    initialValues: object,
    isAddressIncorrect: bool,
    submit: func.isRequired,
    submitting: bool
};

AddressForm.defaultProps = {
    initialValues: {}
};

export default AddressForm;

/*
const mockAddress = {
    country_id: 'US',
    firstname: 'Veronica',
    lastname: 'Costello',
    street: ['6146 Honey Bluff Parkway'],
    city: 'Calder',
    postcode: '49628-7978',
    region_id: 33,
    region_code: 'MI',
    region: 'Michigan',
    telephone: '(555) 229-3326',
    email: 'veronica@example.com'
};
*/
