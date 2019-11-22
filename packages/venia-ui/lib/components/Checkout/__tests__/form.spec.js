import React, { useState } from 'react';
import { createTestInstance } from '@magento/peregrine';

import Form from '../form';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const stateSpy = jest.spyOn(React, 'useState');

    return Object.assign(React, { useState: stateSpy });
});
jest.mock('@magento/peregrine/lib/talons/Checkout/useForm', () => {
    return {
        useForm: jest.fn(() => ({ countries: [] }))
    };
});

jest.mock('../../../classify');
jest.mock('../editableForm', () => 'EditableForm');
jest.mock('../overview', () => 'Overview');

const defaultProps = {
    classes: {
        root: 'root'
    }
};

test('renders an overview Form component if not editing', () => {
    const component = createTestInstance(<Form {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders an editable Form component if editing', () => {
    // Arrange.
    const props = {
        ...defaultProps,
        editing: 'address'
    };
    useState.mockReturnValueOnce([true]);

    // Act.
    const component = createTestInstance(<Form {...props} />);

    // Assert.
    expect(component.toJSON()).toMatchSnapshot();
});
