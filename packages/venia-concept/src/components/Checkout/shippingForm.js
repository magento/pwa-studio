import React, { Component } from 'react';
import { Form } from 'informed';
import { array, bool, func, shape, string } from 'prop-types';

import Button from 'src/components/Button';
import Label from './label';
import Select from 'src/components/Select';

import classify from 'src/classify';
import defaultClasses from './shippingForm.css';

class ShippingForm extends Component {
    static propTypes = {
        availableShippingMethods: array.isRequired,
        cancel: func.isRequired,
        classes: shape({
            body: string,
            footer: string,
            heading: string,
            shippingMethod: string
        }),
        shippingMethod: string,
        submit: func.isRequired,
        submitting: bool
    };

    static defaultProps = {
        availableShippingMethods: [{}]
    };

    render() {
        const {
            availableShippingMethods,
            classes,
            shippingMethod,
            submitting
        } = this.props;

        const selectableShippingMethods = availableShippingMethods.map(
            ({ code, title }) => ({ label: title, value: code })
        );
        const initialValue =
            shippingMethod || availableShippingMethods[0].carrier_code || '';

        return (
            <Form className={classes.root} onSubmit={this.submit}>
                <div className={classes.body}>
                    <h2 className={classes.heading}>Shipping Information</h2>
                    <div className={classes.shippingMethod}>
                        <Label htmlFor={classes.shippingMethod}>
                            Shipping Method
                        </Label>
                        <Select
                            field="shippingMethod"
                            initialValue={initialValue}
                            items={selectableShippingMethods}
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

    submit = ({ shippingMethod }) => {
        const selectedShippingMethod = this.props.availableShippingMethods.find(
            ({ code }) => code === shippingMethod
        );

        if (!selectedShippingMethod) {
            console.warn(
                `Could not find the selected shipping method ${selectedShippingMethod} in the list of available shipping methods.`
            );
            this.cancel();
            return;
        }

        this.props.submit({ shippingMethod: selectedShippingMethod });
    };
}

export default classify(defaultClasses)(ShippingForm);
