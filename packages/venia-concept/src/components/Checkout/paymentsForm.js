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
        availablePaymentMethods: array,
        cancel: func,
        classes: shape({
            body: string,
            footer: string,
            heading: string,
            paymentMethod: string,
        }),
        paymentMethod: string,
        submit: func,
        submitting: bool,
    };

    constructor(...args) {
        super(...args);

        this.state = {
            paymentMethod: this.props.paymentMethod
        };
    }

    componentDidMount() {
        // If we don't have a payment method, default to the first available one.
        const { availablePaymentMethods, paymentMethod } = this.props;
        if (!paymentMethod) {
            this.modifyPaymentMethod(availablePaymentMethods[0]);
        }
    }

    render() {
        const { availablePaymentMethods, classes, paymentMethod, submitting } = this.props;

        // TODO: fix this hack that gets around React warnings about items having unique keys.
        // We have to add a 'value' prop due to the Select component's getItemKey function.
        const selectablePaymentMethods = availablePaymentMethods.map(method => ({
            ...method,
            value: method.title,
        }));

        return (
            <Form
                className={classes.root}
                onSubmit={this.submit}
            >
                <div className={classes.body}>
                    <h2 className={classes.heading}>Billing Information</h2>
                    <div className={classes.paymentMethod}>
                        <Label htmlFor={classes.paymentMethod}>Payment Method</Label>
                        <Select
                            items={selectablePaymentMethods}
                            value={paymentMethod}
                            onChange={this.modifyPaymentMethod}
                        />
                    </div>
                </div>
                <div className={classes.footer}>
                    <Button type="submit" disabled={submitting}>
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

    modifyPaymentMethod = paymentMethod => {
        this.setState({ paymentMethod });
    }

    submit = () => {
        const { paymentMethod } = this.state;

        this.props.submit({ paymentMethod });
    };
}

export default classify(defaultClasses)(PaymentsForm);
