import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useCustomerForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useCustomerForm';

import CustomerForm from '../customerForm';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useCustomerForm'
);
jest.mock('../../../../../classify');
jest.mock('../../../../Country', () => 'Country');
jest.mock('../../../../FormError', () => 'FormError');
jest.mock('../../../../Region', () => 'Region');

const mockProps = {
    afterSubmit: jest.fn(),
    onCancel: jest.fn(),
    onSuccess: jest.fn()
};

const handleCancel = jest.fn().mockName('handleCancel');
const handleSubmit = jest.fn().mockName('handleSubmit');

test('renders loading indicator', () => {
    useCustomerForm.mockReturnValueOnce({
        isLoading: true
    });

    const tree = createTestInstance(<CustomerForm {...mockProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders special form for initial default address entry', () => {
    useCustomerForm.mockReturnValueOnce({
        errors: new Map([['error', new Error('Form Error')]]),
        handleCancel,
        handleSubmit,
        hasDefaultShipping: false,
        initialValues: {
            country: 'US',
            email: 'fry@planet.express',
            firstname: 'Philip',
            lastname: 'Fry',
            region: ''
        },
        isLoading: false,
        isSaving: false,
        isUpdate: false
    });

    const tree = createTestInstance(<CustomerForm {...mockProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe('renders prefilled form with data', () => {
    const initialValues = {
        city: 'Manhattan',
        country: 'US',
        default_shipping: true,
        email: 'fry@planet.express',
        firstname: 'Philip',
        lastname: 'Fry',
        postcode: '10019',
        region: 'NY',
        street: ['3000 57th Street', 'Suite 200'],
        telephone: '(123) 456-7890'
    };

    test('with enabled buttons', () => {
        useCustomerForm.mockReturnValueOnce({
            errors: new Map(),
            handleCancel,
            handleSubmit,
            hasDefaultShipping: true,
            initialValues,
            isLoading: false,
            isSaving: false,
            isUpdate: true
        });

        const tree = createTestInstance(<CustomerForm {...mockProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with disabled buttons', () => {
        useCustomerForm.mockReturnValueOnce({
            errors: new Map(),
            handleCancel,
            handleSubmit,
            hasDefaultShipping: true,
            initialValues: {
                ...initialValues,
                default_shipping: false
            },
            isLoading: false,
            isSaving: true,
            isUpdate: true
        });

        const tree = createTestInstance(<CustomerForm {...mockProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
