import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';
import { useCountry } from '@magento/peregrine/lib/talons/Country/useCountry';

import Country from '../country';

jest.mock('@magento/peregrine/lib/talons/Country/useCountry');
jest.mock('../../../classify');

const mockProps = {
    field: 'country',
    initialValue: 'US',
    label: 'Country',
    validate: jest.fn()
};

test('renders a disabled dropdown while loading', () => {
    useCountry.mockReturnValueOnce({
        countries: [],
        loading: true
    });

    const tree = createTestInstance(
        <Form>
            <Country {...mockProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders dropdown with country data', () => {
    useCountry.mockReturnValueOnce({
        countries: [
            { label: 'United State', value: 'US' },
            { label: 'France', value: 'FR' }
        ],
        loading: false
    });

    const tree = createTestInstance(
        <Form>
            <Country {...mockProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
