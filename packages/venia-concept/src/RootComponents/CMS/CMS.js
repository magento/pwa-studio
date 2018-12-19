import React, { Component } from 'react';
import { Form } from 'informed';

import Checkbox from 'src/components/Checkbox';
import Field from 'src/components/Field';
import RadioGroup from 'src/components/RadioGroup';
import Select from 'src/components/Select';
import TextArea from 'src/components/TextArea';
import TextInput from 'src/components/TextInput';

const handleSubmit = values => {
    console.log(values);
};

const deliveryOptions = [
    {
        label: 'Delivery',
        value: 'yes'
    },
    {
        label: 'Pickup',
        value: 'no'
    }
];

const sizeOptions = [
    {
        label: 'Small',
        value: 's'
    },
    {
        label: 'Medium',
        value: 'm'
    },
    {
        label: 'Large',
        value: 'l'
    }
];

const validateName = value =>
    !value || value.length < 5
        ? 'Name must be at least five characters long.'
        : null;

const validateSize = value =>
    value !== 'l' ? 'Come on, you know you want a large!' : null;

export default class CMS extends Component {
    render() {
        return (
            <Form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: 'grid',
                        gap: '0.5rem',
                        margin: '0.5rem',
                        width: '480px'
                    }}
                >
                    <Field label="Name">
                        <TextInput
                            field="name"
                            validate={validateName}
                            message="Enter at least 5 characters."
                        />
                    </Field>
                    <Field label="Instructions">
                        <TextArea field="instructions" />
                    </Field>
                    <Field label="Size">
                        <Select
                            field="size"
                            items={sizeOptions}
                            validate={validateSize}
                            validateOnChange
                        />
                    </Field>
                    <Field label="Toppings">
                        <div>
                            <Checkbox
                                field="toppings.pepperoni"
                                label="Pepperoni"
                            />
                            <Checkbox
                                field="toppings.pineapple"
                                label="Pineapple"
                            />
                        </div>
                    </Field>
                    <Field label="Delivery">
                        <RadioGroup field="delivery" items={deliveryOptions} />
                    </Field>
                </div>
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
