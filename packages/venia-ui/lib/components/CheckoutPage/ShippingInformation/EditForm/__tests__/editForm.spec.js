import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useEditForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/EditForm/useEditForm';

import EditForm from '../editForm';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/EditForm/useEditForm'
);
jest.mock('../../../../../classify');
jest.mock('../../../../Country', () => 'Country');
jest.mock('../../../../Region', () => 'Region');

const mockProps = {
    afterSubmit: jest.fn(),
    onCancel: jest.fn()
};

test('renders empty form without data', () => {
    useEditForm.mockReturnValueOnce({
        handleSubmit: jest.fn(),
        initialValues: {
            country: 'US',
            region: ''
        },
        isSaving: false,
        isUpdate: false
    });

    const tree = createTestInstance(<EditForm {...mockProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

describe('renders prefilled form with data', () => {
    const initialValues = {
        city: 'Manhattan',
        country: 'US',
        email: 'fry@planet.express',
        firstname: 'Philip',
        lastname: 'Fry',
        postcode: '10019',
        region: 'NY',
        street: ['3000 57th Street', 'Suite 200'],
        telephone: '(123) 456-7890'
    };

    test('with enabled buttons', () => {
        useEditForm.mockReturnValueOnce({
            handleSubmit: jest.fn(),
            initialValues,
            isSaving: false,
            isUpdate: true
        });

        const tree = createTestInstance(<EditForm {...mockProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with disabled buttons', () => {
        useEditForm.mockReturnValueOnce({
            handleSubmit: jest.fn(),
            initialValues,
            isSaving: true,
            isUpdate: true
        });

        const tree = createTestInstance(<EditForm {...mockProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
