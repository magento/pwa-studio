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
            button: string,
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

        let initialValue;
        let selectableShippingMethods;

        if (availableShippingMethods.length) {
            selectableShippingMethods = availableShippingMethods.map(
                ({ carrier_code, carrier_title }) => ({
                    label: carrier_title,
                    value: carrier_code
                })
            );
            initialValue =
                shippingMethod || availableShippingMethods[0].carrier_code;
        } else {
            selectableShippingMethods = [];
            initialValue = '';
        }

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
                    <Button className={classes.button} onClick={this.cancel}>
                        Cancel
                    </Button>
                    <Button
                        className={classes.button}
                        priority="high"
                        type="submit"
                        disabled={submitting}
                    >
                        Use Method
                    </Button>
                </div>
            </Form>
        );
    }

    cancel = () => {
        this.props.cancel();
    };

    submit = ({ shippingMethod }) => {
        const selectedShippingMethod = this.props.availableShippingMethods.find(
            ({ carrier_code }) => carrier_code === shippingMethod
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
