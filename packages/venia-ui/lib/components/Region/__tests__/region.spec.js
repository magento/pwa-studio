import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';
import { useRegion } from '@magento/peregrine/lib/talons/Region/useRegion';

import Region from '../region';

jest.mock('@magento/peregrine/lib/talons/Region/useRegion');
jest.mock('../../../classify');

const mockProps = {
    initialValue: 'TX',
    validate: jest.fn()
};

test('renders disabled dropdown while loading', () => {
    useRegion.mockReturnValueOnce({
        loading: true,
        regions: [{ label: 'Loading...', value: '' }]
    });

    const tree = createTestInstance(
        <Form>
            <Region {...mockProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders input with no regions', () => {
    useRegion.mockReturnValueOnce({
        loading: false,
        regions: []
    });

    const tree = createTestInstance(
        <Form>
            <Region {...mockProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders dropdown with regions', () => {
    useRegion.mockReturnValueOnce({
        loading: false,
        regions: [
            { label: 'Texas', value: 'TX' },
            { label: 'New Mexico', value: 'NM' }
        ]
    });

    const tree = createTestInstance(
        <Form>
            <Region {...mockProps} />
        </Form>
    );

    expect(tree.toJSON()).toMatchSnapshot();
});
