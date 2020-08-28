import React from 'react';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';

import { mergeClasses } from '../../../classify';
import { isRequired } from '../../../util/formValidators';
import Button from '../../Button';
import Field from '../../Field';
import TextInput from '../../TextInput';
import defaultClasses from './forgotPasswordForm.css';

const ForgotPasswordForm = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { initialValues, isResettingPassword, onSubmit, onCancel } = props;

    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={onSubmit}
        >
            <Field label="Email address">
                <TextInput
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                />
            </Field>
            <div className={classes.buttonContainer}>
                <Button
                    className={classes.cancelButton}
                    disabled={isResettingPassword}
                    type="button"
                    priority="normal"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    className={classes.submitButton}
                    disabled={isResettingPassword}
                    type="submit"
                    priority="high"
                >
                    Submit
                </Button>
            </div>
        </Form>
    );
};

ForgotPasswordForm.propTypes = {
    classes: shape({
        form: string,
        buttonContainer: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func.isRequired,
    onSubmit: func.isRequired
};

ForgotPasswordForm.defaultProps = {
    initialValues: {}
};

export default ForgotPasswordForm;
