import React from 'react';
import AddressForm from '../addressForm';
import { createTestInstance } from '@magento/peregrine';
import { useAddressForm } from '@magento/peregrine/lib/talons/Checkout/useAddressForm';
import Button from '../../Button';
import { Form } from 'informed';

jest.mock('../../../classify');
jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');

    return {
        ...apolloClient,
        useMutation: jest
            .fn()
            .mockImplementation(() => [jest.fn().mockResolvedValue()])
    };
});
jest.mock('@magento/peregrine/lib/context/checkout', () => {
    const state = {
        shippingAddress: {},
        shippingAddressError: null
    };
    const api = {
        submitShippingAddress: jest.fn()
    };
    const useCheckoutContext = jest.fn(() => [state, api]);

    return { useCheckoutContext };
});

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: false
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/talons/Checkout/useAddressForm', () => {
    const useAddressForm = jest.fn(props => ({
        error: '',
        handleCancel: jest.fn(() => {
            props.onCancel();
        }),
        handleSubmit: jest.fn(() => {
            props.onSubmit();
        }),
        initialValues: {},
        isSignedIn: false
    }));
    return { useAddressForm };
});

const mockCancel = jest.fn();
const mockSubmit = jest.fn();
const defaultProps = {
    onCancel: mockCancel,
    onSubmit: mockSubmit
};

beforeEach(() => {
    mockCancel.mockReset();
    mockSubmit.mockReset();
});

test('renders an AddressForm component', () => {
    const instance = createTestInstance(<AddressForm {...defaultProps} />);

    expect(instance.toJSON()).toMatchSnapshot();
});

test('renders validation block with message if address is incorrect', () => {
    useAddressForm.mockReturnValueOnce({
        ...useAddressForm(),
        error: 'Oops'
    });

    const instance = createTestInstance(<AddressForm {...defaultProps} />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('cancelling the form calls onCancel prop', () => {
    const { root } = createTestInstance(<AddressForm {...defaultProps} />);

    const button = root.findAllByType(Button)[1];
    button.props.onClick();
    expect(mockCancel).toHaveBeenCalled();
});

test('submitting the form calls onSubmit prop', () => {
    const { root } = createTestInstance(<AddressForm {...defaultProps} />);

    const form = root.findAllByType(Form)[0];
    form.props.onSubmit();
    expect(mockSubmit).toHaveBeenCalled();
});
