import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useGuestSignIn } from '@magento/peregrine/lib/talons/CheckoutPage/GuestSignIn/useGuestSignIn';

import GuestSignIn from '../guestSignIn';

jest.mock(
    '@magento/peregrine/lib/talons/CheckoutPage/GuestSignIn/useGuestSignIn'
);
jest.mock('@magento/venia-ui/lib/classify');
jest.mock(
    '@magento/venia-ui/lib/components/CreateAccount',
    () => 'CreateAccount'
);
jest.mock(
    '@magento/venia-ui/lib/components/ForgotPassword',
    () => 'ForgotPassword'
);
jest.mock('@magento/venia-ui/lib/components/SignIn', () => 'SignIn');

const defaultProps = {
    isActive: true,
    toggleActiveContent: jest.fn().mockName('toggleActiveContent')
};

const defaultTalonProps = {
    handleBackToCheckout: jest.fn().mockName('handleBackToCheckout'),
    toggleCreateAccountView: jest.fn().mockName('toggleCreateAccountView'),
    toggleForgotPasswordView: jest.fn().mockName('toggleForgotPasswordView'),
    view: 'SIGNIN'
};

test('renders SignIn component', () => {
    useGuestSignIn.mockReturnValue(defaultTalonProps);
    const tree = createTestInstance(
        <GuestSignIn {...defaultProps} isActive={false} />
    );

    expect(useGuestSignIn.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "toggleActiveContent": [MockFunction toggleActiveContent],
        }
    `);

    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders ForgotPassword component', () => {
    useGuestSignIn.mockReturnValue({
        ...defaultTalonProps,
        view: 'FORGOT_PASSWORD'
    });

    const tree = createTestInstance(<GuestSignIn {...defaultProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});

test('renders CreateAccount component', () => {
    useGuestSignIn.mockReturnValue({
        ...defaultTalonProps,
        view: 'CREATE_ACCOUNT'
    });

    const tree = createTestInstance(<GuestSignIn {...defaultProps} />);
    expect(tree.toJSON()).toMatchSnapshot();
});
