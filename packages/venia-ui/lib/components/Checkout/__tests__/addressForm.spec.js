import React from 'react';
import AddressForm from '../addressForm';
import { createTestInstance } from '@magento/peregrine';

jest.mock('../../../classify');
jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest
        .fn()
        .mockImplementation(() => [jest.fn().mockResolvedValue()])
}));
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
    const props = {
        ...defaultProps,
        error: 'Oops'
    };

    const instance = createTestInstance(<AddressForm {...props} />);
    expect(instance.toJSON()).toMatchSnapshot();
});

test('cancel instance function calls props cancel function', () => {
    const { root } = createTestInstance(<AddressForm {...defaultProps} />);

    const button = root.findAllByProps({ className: 'root_normalPriority' })[0];
    button.props.onClick();
    expect(mockCancel).toHaveBeenCalled();
});
