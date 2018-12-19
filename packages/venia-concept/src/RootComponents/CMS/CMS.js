import React, { Component } from 'react';
import { Form } from 'informed';

import Checkbox from 'src/components/Checkbox';
import Field from 'src/components/Field';
import RadioGroup from 'src/components/RadioGroup';
import TextArea from 'src/components/TextArea';
import TextInput from 'src/components/TextInput';

const handleSubmit = values => {
    console.log(values);
};

const registerOptions = [
    {
        label: 'Yes',
        value: 'yes'
    },
    {
        label: 'No',
        value: 'no'
    }
];

const validateTitle = value =>
    !value || value.length < 5
        ? 'Title must be at least five characters long.'
        : null;

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
                    <Field label="Title">
                        <TextInput
                            field="title"
                            validate={validateTitle}
                            message="Enter at least 5 characters."
                        />
                    </Field>
                    <Field label="Description">
                        <TextArea field="description" />
                    </Field>
                    <Field label="Register">
                        <RadioGroup field="register" items={registerOptions} />
                    </Field>
                    <Field label="Contact Preference">
                        <div>
                            <Checkbox field="pref.phone" label="Phone" />
                            <Checkbox field="pref.email" label="Email" />
                        </div>
                    </Field>
                </div>
                <button type="submit">Submit</button>
            </Form>
        );
    }
}
