import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useGuestForm } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useGuestForm';

import GuestForm from '../guestForm';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/useGuestForm'
);
jest.mock('../../../../../classify');
jest.mock('../../../../Country', () => 'Country');
jest.mock('../../../../FormError', () => 'FormError');
jest.mock('../../../../Region', () => 'Region');

const mockProps = {
    afterSubmit: jest.fn(),
    onCancel: jest.fn()
};

const handleCancel = jest.fn().mockName('handleCancel');
const handleSubmit = jest.fn().mockName('handleSubmit');
const emptyFormProps = {
    errors: new Map(),
    handleCancel,
    handleSubmit,
    initialValues: {
        country: 'US',
        region: ''
    },
    isSaving: false,
    isUpdate: false
};

test('renders empty form without data', () => {
    useGuestForm.mockReturnValueOnce(emptyFormProps);

    const tree = createTestInstance(<GuestForm {...mockProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders form error', () => {
    useGuestForm.mockReturnValueOnce({
        ...emptyFormProps,
        errors: new Map([['error', new Error('Form Error')]])
    });

    const tree = createTestInstance(<GuestForm {...mockProps} />);
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
        region: {
            region: 'New York',
            region_code: 'NY',
            region_id: 12
        },
        street: ['3000 57th Street', 'Suite 200'],
        telephone: '(123) 456-7890'
    };

    test('with enabled buttons', () => {
        useGuestForm.mockReturnValueOnce({
            errors: new Map(),
            handleCancel,
            handleSubmit,
            initialValues,
            isSaving: false,
            isUpdate: true
        });

        const tree = createTestInstance(<GuestForm {...mockProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });

    test('with disabled buttons', () => {
        useGuestForm.mockReturnValueOnce({
            errors: new Map(),
            handleCancel,
            handleSubmit,
            initialValues,
            isSaving: true,
            isUpdate: true
        });

        const tree = createTestInstance(<GuestForm {...mockProps} />);
        expect(tree.toJSON()).toMatchSnapshot();
    });
});
