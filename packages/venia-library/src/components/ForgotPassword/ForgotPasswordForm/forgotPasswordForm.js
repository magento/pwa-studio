import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import Button from 'src/components/Button';
import Field from 'src/components/Field';
import TextInput from 'src/components/TextInput';

import { isRequired } from 'src/util/formValidators';

import classify from 'src/classify';
import defaultClasses from './forgotPasswordForm.css';

class ForgotPasswordForm extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            form: PropTypes.string,
            buttonContainer: PropTypes.string
        }),
        initialValues: PropTypes.shape({
            email: PropTypes.string
        }),
        onSubmit: PropTypes.func.isRequired
    };

    static defaultProps = {
        initialValues: {}
    };

    render() {
        const { classes, initialValues, onSubmit } = this.props;

        return (
            <Form
                className={classes.root}
                initialValues={initialValues}
                onSubmit={onSubmit}
            >
                <Field label="Email Address" required={true}>
                    <TextInput
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <div className={classes.buttonContainer}>
                    <Button type="submit" priority="high">
                        Submit
                    </Button>
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(ForgotPasswordForm);
