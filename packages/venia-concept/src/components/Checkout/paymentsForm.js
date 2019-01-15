import React, { Component } from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import Button from 'src/components/Button';
import Label from './label';
import Select from 'src/components/Select';

import classify from 'src/classify';
import defaultClasses from './paymentsForm.css';

class PaymentsForm extends Component {
    static propTypes = {
        availablePaymentMethods: array.isRequired,
        cancel: func.isRequired,
        classes: shape({
            body: string,
            footer: string,
            heading: string,
            paymentMethod: string
        }),
        paymentMethod: string,
        submit: func.isRequired,
        submitting: bool
    };

    static defaultProps = {
        availablePaymentMethods: [{}]
    };

    render() {
        const {
            availablePaymentMethods,
            classes,
            paymentMethod,
            submitting
        } = this.props;

        const selectablePaymentMethods = availablePaymentMethods.map(
            ({ code, title }) => ({ label: title, value: code })
        );
        const initialValue =
            paymentMethod || availablePaymentMethods[0].code || '';

        return (
            <Form className={classes.root} onSubmit={this.submit}>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Billing Information</h2>
                    <div className={classes.paymentMethod}>
                        <Label htmlFor={classes.paymentMethod}>
                            Payment Method
                        </Label>
                        <Select
                            field="paymentMethod"
                            initialValue={initialValue}
                            items={selectablePaymentMethods}
                        />
                    </div>
                </div>
                <div className={classes.footer}>
                    <Button priority="high" type="submit" disabled={submitting}>
                        Save
                    </Button>
                    <Button onClick={this.cancel}>Cancel</Button>
                </div>
            </Form>
        );
    }

    cancel = () => {
        this.props.cancel();
    };

    submit = ({ paymentMethod }) => {
        const selectedPaymentMethod = this.props.availablePaymentMethods.find(
            ({ code }) => code === paymentMethod
        );

        if (!selectedPaymentMethod) {
            console.warn(
                `Could not find the selected payment method ${selectedPaymentMethod} in the list of available payment methods.`
            );
            this.cancel();
            return;
        }

        this.props.submit({ paymentMethod: selectedPaymentMethod });
    };
}

export default classify(defaultClasses)(PaymentsForm);
