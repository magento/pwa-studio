import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Autocomplete from '../autocomplete';

jest.mock('../../../classify');
jest.mock('../suggestions', () => () => null);

test('renders correctly', () => {
    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={false} />
        </Form>
    );

    expect(root.findByProps({ className: 'root_hidden' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});

test('renders correctly when visible', () => {
    const { root } = createTestInstance(
        <Form>
            <Autocomplete visible={true} />
        </Form>
    );

    expect(root.findByProps({ className: 'root_visible' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});
