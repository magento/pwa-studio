import React from 'react';
import { InMemoryCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';
import typePolicies from '@magento/peregrine/lib/Apollo/policies';

import Autocomplete from '../autocomplete';
import { IntlProvider } from 'react-intl';

jest.mock('../../../classify');
jest.mock('../suggestions', () => () => null);

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const cache = new InMemoryCache({
    typePolicies
});

test('renders correctly', () => {
    const { root } = createTestInstance(
        <MockedProvider addTypename={true} cache={cache}>
            <IntlProvider locale="en-US">
                <Form>
                    <Autocomplete visible={false} />
                </Form>
            </IntlProvider>
        </MockedProvider>
    );

    expect(root.findByProps({ className: 'root_hidden' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});

test('renders correctly when visible', () => {
    const { root } = createTestInstance(
        <MockedProvider addTypename={true} cache={cache}>
            <IntlProvider locale="en-US">
                <Form>
                    <Autocomplete visible={true} />
                </Form>
            </IntlProvider>
        </MockedProvider>
    );

    expect(root.findByProps({ className: 'root_visible' })).toBeTruthy();
    expect(root.findByProps({ className: 'message' })).toBeTruthy();
    expect(root.findByProps({ className: 'suggestions' })).toBeTruthy();
});
