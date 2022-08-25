import React, { useState } from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useForm } from '@magento/peregrine/lib/talons/Checkout/useForm';

import Form from '../form';

jest.mock('react', () => {
    const React = jest.requireActual('react');
    const stateSpy = jest.spyOn(React, 'useState');

    return Object.assign(React, { useState: stateSpy });
});

jest.mock('@magento/peregrine/lib/talons/Checkout/useForm', () => {
    const useFormTalon = jest.requireActual(
        '@magento/peregrine/lib/talons/Checkout/useForm'
    );

    const spy = jest.spyOn(useFormTalon, 'useForm');

    return Object.assign(useFormTalon, { useForm: spy });
});

const mockAddToast = jest.fn();
jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [
        { toasts: new Map() },
        { addToast: mockAddToast }
    ]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

jest.mock('../../../classify');
jest.mock('../editableForm', () => 'EditableForm');
jest.mock('../overview', () => 'Overview');
jest.mock('../../LoadingIndicator', () => 'LoadingIndicator');

const defaultProps = {
    classes: {
        root: 'root'
    },
    setStep: jest.fn()
};
const talonProps = {
    countries: [],
    hasError: false,
    isLoading: false
};

test('renders an overview Form component if not editing', () => {
    // Arrange.
    useForm.mockReturnValueOnce(talonProps);

    // Act.
    const component = createTestInstance(<Form {...defaultProps} />);

    // Assert.
    expect(component.toJSON()).toMatchSnapshot();
});

test('renders an editable Form component if editing', () => {
    // Arrange.
    const props = {
        ...defaultProps,
        editing: 'address'
    };
    useState.mockReturnValueOnce([true]);
    useForm.mockReturnValueOnce(talonProps);

    // Act.
    const component = createTestInstance(<Form {...props} />);

    // Assert.
    expect(component.toJSON()).toMatchSnapshot();
});

test('pops a Toast when unable to fetch countries', () => {
    // Arrange.
    const myTalonProps = {
        ...talonProps,
        hasError: true
    };
    useForm.mockReturnValueOnce(myTalonProps);

    // Act.
    createTestInstance(<Form {...defaultProps} />);

    // Assert.
    expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        icon: expect.any(Object),
        message: expect.any(String),
        timeout: expect.any(Number)
    });
});
