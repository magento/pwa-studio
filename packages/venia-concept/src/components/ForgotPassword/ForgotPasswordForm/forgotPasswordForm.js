import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'informed';
import Input from 'src/components/Input';
import Button from 'src/components/Button';
import classify from 'src/classify';
import defaultClasses from './forgotPasswordForm.css';
// TODO: remove after merging common dark theme button classes
import darkButtonClasses from '../darkButton.css';

class ForgotPasswordForm extends Component {
    static propTypes = {
        classes: PropTypes.shape({}),
        initialValues: PropTypes.shape({}),
        onSubmit: PropTypes.func
    };

    static defaultProps = {
        initialValues: {}
    };

    render() {
        const { initialValues, classes, onSubmit } = this.props;

        return (
            <Form className={classes.form} onSubmit={onSubmit}>
                <Input
                    label="Email Address"
                    autoComplete="email"
                    field="email"
                    initialValue={initialValues.email}
                    required
                    selected
                />
                <div className={classes.buttonContainer}>
                    <Button type="submit" classes={darkButtonClasses}>
                        Submit
                    </Button>
                </div>
            </Form>
        );
    }
}

export default classify(defaultClasses)(ForgotPasswordForm);
