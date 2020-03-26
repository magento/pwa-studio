import React from 'react';
import { Form } from 'informed';
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
    const { afterSubmit, classes: propClasses, shippingData } = props;
    const talonProps = useEditForm({
        afterSubmit,
        ...EditFormOperations,
        shippingData
    });
    const { handleSubmit, initialValues, isSaving, isUpdate } = talonProps;
    const classes = mergeClasses(defaultClasses, propClasses);

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <Field classes={{ root: classes.field }} id="email" label="Email">
                <TextInput field="email" validate={isRequired} />
                <Message fieldState={{}}>
                    Set a password at the end of guest checkout to create an
                    account in one easy step.
                </Message>
            </Field>
            <Field
                classes={{ root: classes.firstname }}
                id="firstname"
                label="First Name"
            >
                <TextInput field="firstname" validate={isRequired} />
            </Field>
            <Field
                classes={{ root: classes.lastname }}
                id="lastname"
                label="Last Name"
            >
                <TextInput field="lastname" validate={isRequired} />
            </Field>
            <Country classes={{ root: classes.field }} validate={isRequired} />
            <Field
                classes={{ root: classes.field }}
                id="street0"
                label="Street Address"
            >
                <TextInput field="street[0]" validate={isRequired} />
            </Field>
            <Field
                classes={{ root: classes.field }}
                id="street1"
                label="Street Address 2"
            >
                <TextInput field="street[1]" />
            </Field>
            <Field classes={{ root: classes.field }} id="city" label="City">
                <TextInput field="city" validate={isRequired} />
            </Field>
            <Region classes={{ root: classes.field }} validate={isRequired} />
            <Field
                classes={{ root: classes.field }}
                id="postcode"
                label="ZIP / Postal Code"
            >
                <TextInput field="postcode" validate={isRequired} />
            </Field>
            <Field
                classes={{ root: classes.field }}
                id="telephone"
                label="Phone Number"
            >
                <TextInput field="telephone" validate={isRequired} />
            </Field>
            <Button
                classes={{ root_normalPriority: classes.submit }}
                disabled={isSaving}
                priority="normal"
                type="submit"
            >
                {isUpdate ? 'Update' : 'Continue to Shipping Method'}
            </Button>
        </Form>
    );
};

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

export default EditForm;
