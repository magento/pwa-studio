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
        availableShippingMethods: array,
        cancel: func,
        classes: shape({
            body: string,
            footer: string,
            heading: string,
            shippingMethod: string,
        }),
        shippingMethod: string,
        submit: func,
        submitting: bool,
    };

    constructor(...args) {
        super(...args);

        this.state = {
            shippingMethod: this.props.shippingMethod
        };
    }

    componentDidMount() {
        // If we don't have a shipping method, default to the first available one.
        const { availableShippingMethods, shippingMethod } = this.props;
        if (!shippingMethod) {
            this.modifyShippingMethod(availableShippingMethods[0]);
        }
    }

    render() {
        const { availableShippingMethods, classes, shippingMethod, submitting } = this.props;

        // TODO: fix this hack that gets around React warnings about items having unique keys.
        // We have to add a 'value' prop due to the Select component's getItemKey function.
        const selectableShippingMethods = availableShippingMethods.map(method => ({
            ...method,
            value: method.title,
        }));

        return (
            <Form
                className={classes.root}
                onSubmit={this.submit}
            >
                <div className={classes.body}>
                    <h2 className={classes.heading}>Shipping Information</h2>
                    <div className={classes.shippingMethod}>
                        <Label htmlFor={classes.shippingMethod}>Shipping Method</Label>
                        <Select
                            items={selectableShippingMethods}
                            value={shippingMethod}
                            onChange={this.modifyShippingMethod}
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

    modifyShippingMethod = shippingMethod => {
        this.setState({ shippingMethod });
    }

    submit = () => {
        const { shippingMethod } = this.state;

        this.props.submit({ shippingMethod });
    };
}

export default classify(defaultClasses)(ShippingForm);
