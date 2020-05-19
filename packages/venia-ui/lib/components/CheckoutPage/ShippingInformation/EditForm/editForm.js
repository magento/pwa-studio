import React from 'react';
import { Form } from 'informed';
import { func, shape, string, arrayOf } from 'prop-types';
import { useEditForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/EditForm/useEditForm';

import { mergeClasses } from '../../../../classify';
import { isRequired } from '../../../../util/formValidators';
import Button from '../../../Button';
import Country from '../../../Country';
import Field, { Message } from '../../../Field';
import Region from '../../../Region';
import TextInput from '../../../TextInput';
import defaultClasses from './editForm.css';
import EditFormOperations from './editForm.gql';

const EditForm = props => {
    const { afterSubmit, classes: propClasses, onCancel, shippingData } = props;

    const talonProps = useEditForm({
        afterSubmit,
        ...EditFormOperations,
        onCancel,
        shippingData
    });
    const {
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving,
        isUpdate
    } = talonProps;

    const classes = mergeClasses(defaultClasses, propClasses);

    const messageElement = !isUpdate ? (
        <Message>
            {
                'Set a password at the end of guest checkout to create an account in one easy step.'
            }
        </Message>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button
            classes={{
                root_normalPriority: classes.submit
            }}
            disabled={isSaving}
            onClick={handleCancel}
            priority="normal"
        >
            {'Cancel'}
        </Button>
    ) : null;

    const submitButton = (
        <Button
            classes={{
                root_normalPriority: classes.submit,
                root_highPriority: classes.submit_update
            }}
            disabled={isSaving}
            priority={isUpdate ? 'high' : 'normal'}
            type="submit"
        >
            {isUpdate ? 'Update' : 'Continue to Shipping Method'}
        </Button>
    );

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <div className={classes.email}>
                <Field id="email" label="Email">
                    <TextInput field="email" validate={isRequired} />
                    {messageElement}
                </Field>
            </div>
            <div className={classes.firstname}>
                <Field id="firstname" label="First Name">
                    <TextInput field="firstname" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.lastname}>
                <Field id="lastname" label="Last Name">
                    <TextInput field="lastname" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.country}>
                <Country validate={isRequired} />
            </div>
            <div className={classes.street0}>
                <Field id="street0" label="Street Address">
                    <TextInput field="street[0]" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.street1}>
                <Field id="street1" label="Street Address 2">
                    <TextInput field="street[1]" />
                </Field>
            </div>
            <div className={classes.city}>
                <Field id="city" label="City">
                    <TextInput field="city" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.region}>
                <Region validate={isRequired} />
            </div>
            <div className={classes.postcode}>
                <Field id="postcode" label="ZIP / Postal Code">
                    <TextInput field="postcode" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.telephone}>
                <Field id="telephone" label="Phone Number">
                    <TextInput field="telephone" validate={isRequired} />
                </Field>
            </div>
            <div className={classes.buttons}>
                {cancelButton}
                {submitButton}
            </div>
        </Form>
    );
};

export default EditForm;

EditForm.defaultProps = {
    shippingData: {
        country: {
            code: 'US'
        },
        region: {
            code: ''
        }
    }
};

EditForm.propTypes = {
    afterSubmit: func,
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        country: string,
        street0: string,
        street1: string,
        city: string,
        region: string,
        postcode: string,
        telephone: string,
        buttons: string,
        submit: string,
        submit_update: string
    }),
    onCancel: func,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        email: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: shape({
            code: string.isRequired
        }).isRequired,
        street: arrayOf(string),
        telephone: string
    })
};
