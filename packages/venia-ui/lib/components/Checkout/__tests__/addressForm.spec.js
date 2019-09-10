import React from 'react';
import { createTestInstance } from '@magento/peregrine';

import Button from '../../../components/Button';
import AddressForm from '../addressForm';

jest.mock('../../../classify');
jest.mock('../../../components/Button', () => () => <i />);

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

<<<<<<< Updated upstream
    const button = root.findAllByProps({ className: 'root_normalPriority' })[0];
=======
    const [button] = root.findAllByType(Button);
>>>>>>> Stashed changes
    button.props.onClick();
    expect(mockCancel).toHaveBeenCalled();
});
