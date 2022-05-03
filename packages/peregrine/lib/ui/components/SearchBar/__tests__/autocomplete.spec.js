import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import Autocomplete from '../autocomplete';
import { IntlProvider } from 'react-intl';

jest.mock('../../../classify');
jest.mock('../suggestions', () => () => null);

test('renders correctly', () => {
    const { root } = createTestInstance(
        <IntlProvider locale="en-US">
            <Form>
                <Autocomplete visible={false} />
            </Form>
        </IntlProvider>
    );

    expect(root.findByProps({ className: 'root_hidden' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});

test('renders correctly when visible', () => {
    const { root } = createTestInstance(
        <IntlProvider locale="en-US">
            <Form>
                <Autocomplete visible={true} />
            </Form>
        </IntlProvider>
    );

    expect(root.findByProps({ className: 'root_visible' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});
