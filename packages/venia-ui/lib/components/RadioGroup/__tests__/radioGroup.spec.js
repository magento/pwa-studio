import React from 'react';
import RadioGroup from '../radioGroup';
import { createTestInstance } from '@magento/peregrine';

const items = [
    { label: 'one', value: '1' },
    { label: 'holy moly two has a lot of content', value: '2' },
    { label: 'three', value: '3' },
    { label: 'four', value: '4' },
    { label: 'five', value: '5' },
    { label: 'six six six six six', value: '6' },
    { label: 'this 7th one', value: '7' },
    { label: 'disabled', value: 'whatever', disabled: true }
];

test('renders as expected', () => {
    const instance = createTestInstance(<RadioGroup items={items} />);
    expect(instance.toJSON()).toMatchSnapshot();
});
