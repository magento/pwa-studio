import React from 'react';
import testRenderer from 'react-test-renderer';

import AddressForm from '../addressForm';

jest.mock('src/classify');

const mockCancel = jest.fn();
const mockSubmit = jest.fn();
const defaultProps = {
    cancel: mockCancel,
    submit: mockSubmit
};

beforeEach(() => {
    mockCancel.mockReset();
    mockSubmit.mockReset();
});

test('renders an AddressForm component', () => {
    const component = testRenderer.create(<AddressForm {...defaultProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('renders validation block with message if address is incorrect', () => {
    const props = {
        ...defaultProps,
        isAddressIncorrect: true,
        incorrectAddressMessage: 'whoops'
    };
    const component = testRenderer.create(<AddressForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('does not renders validation block with message if address is incorrect but no incorrect address message', () => {
    const props = {
        ...defaultProps,
        isAddressIncorrect: true
    };
    const component = testRenderer.create(<AddressForm {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('cancel instance function calls props cancel function', () => {
    const component = testRenderer.create(<AddressForm {...defaultProps} />);
    component.root.children[0].instance.cancel();

    expect(mockCancel).toHaveBeenCalled();
});

test('submit instance function sets isRequestingPaymentNonce true in state', () => {
    const component = testRenderer.create(<AddressForm {...defaultProps} />);
    const value = 'foo';
    component.root.children[0].instance.submit(value);

    expect(mockSubmit).toHaveBeenCalledWith(value);
});
