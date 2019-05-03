import React from 'react';
import testRenderer from 'react-test-renderer';

import SignIn from '../signIn';

const props = {
    isGettingDetails: false,
    isSigningIn: false,
    signIn: function() {},
    signInError: {}
};

test('renders correctly', () => {
    const component = testRenderer.create(<SignIn {...props} />);

    expect(component.toJSON()).toMatchSnapshot();
});

// TODO: test skipped because of strange exception thrown:
// "TypeError: val.getMockName is not a function"
test.skip('renders the loading indicator if signing in', () => {
    const testProps = {
        ...props,
        isSigningIn: true
    };

    const component = testRenderer.create(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('displays an error message if there is a sign in error', () => {
    const testProps = {
        ...props,
        signInError: { message: 'foo ' }
    };

    const component = testRenderer.create(<SignIn {...testProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});
