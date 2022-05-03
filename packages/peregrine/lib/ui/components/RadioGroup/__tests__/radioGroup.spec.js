import React from 'react';
import { Form } from 'informed';
import RadioGroup from '../radioGroup';
import { createTestInstance } from '@magento/peregrine';

jest.mock('informed', () => ({
    ...jest.requireActual('informed'),
    asField: comp => comp,
    Radio: props => <mock-Radio {...props} />,
    BasicRadioGroup: props => <mock-BasicRadioGroup {...props} />
}));

const items = [
    { label: 'one', value: '1' },
    {
        label: 'holy moly two has a lot of content',
        value: '2'
    },
    { label: 'three', value: '3' },
    { label: 'four', value: '4' },
    { label: 'five', value: '5' },
    { label: 'six six six six six', value: '6' },
    { label: 'this 7th one', value: '7' },
    { label: 'disabled', value: 'whatever', disabled: true }
];

const props = {
    field: 'foo',
    items
};

test('renders as expected', () => {
    const instance = createTestInstance(
        <Form>
            <RadioGroup {...props} />
        </Form>
    );
    expect(instance.toJSON()).toMatchSnapshot();
});

test('disables all child radios when disable prop is truthy', () => {
    const instance = createTestInstance(
        <Form>
            <RadioGroup {...props} disabled={true} />
        </Form>
    );
    expect(instance.toJSON()).toMatchSnapshot();
});
