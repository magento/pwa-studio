import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';

import Input from 'src/components/Input';
import Button from 'src/components/Button';
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

    // There is an issue with handling initial values in Input.
    // TODO: Pass initial value to email input after fixing this bug.
    render() {
        const { classes, onSubmit } = this.props;

        return (
            <Form className={classes.form} onSubmit={onSubmit}>
                <Input
                    label="Email Address"
                    autoComplete="email"
                    field="email"
                    required
                    selected
                />
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
