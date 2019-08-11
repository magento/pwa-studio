import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import SignIn from '../signIn';

const props = {
    isGettingDetails: false,
    isSigningIn: false,
    signIn: function() {},
    signInError: {}
};

test('renders correctly', () => {
    const component = createTestInstance(<SignIn {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

// TODO: test skipped because of strange exception thrown:
// "TypeError: val.getMockName is not a function"
test.skip('renders the loading indicator if signing in', () => {
    const testProps = {
        ...props,
        isSigningIn: true
    };

    const component = createTestInstance(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('displays an error message if there is a sign in error', () => {
    const testProps = {
        ...props,
        signInError: { message: 'foo ' }
    };

    const component = createTestInstance(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('calls `onSignIn` when sign in button is pressed', () => {
    const signIn = jest.fn();
    const onForgotPassword = jest.fn();

    const { root } = createTestInstance(
        <SignIn signIn={signIn} onForgotPassword={onForgotPassword} />
    );

    act(() => {
        root.findByType(Form).props.onSubmit();
    });

    expect(signIn).toHaveBeenCalledTimes(1);
});
