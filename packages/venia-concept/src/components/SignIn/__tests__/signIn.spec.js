import React from 'react';
import { shallow, mount } from 'enzyme';
import SignIn from '../signIn';

const props = {
    signIn: function() {},
    signInError: { message: 'foo' }
};

const classes = {
    signInButton: 'a'
};

test('set state `password` to new `password` on `updatePassword`', () => {
    const wrapper = shallow(
        <SignIn
            signIn={props.signIn}
            signInError={props.signInError}
            onForgotPassword={() => {}}
        />
    ).dive();

    const newPassword = 'foo';

    expect(wrapper.state().password).toEqual('');
    wrapper.instance().updatePassword(newPassword);
    expect(wrapper.state().password).toEqual(newPassword);
});

test('set state `username` to new `username` on `updateUsername`', () => {
    const wrapper = shallow(
        <SignIn
            signIn={props.signIn}
            signInError={props.signInError}
            onForgotPassword={() => {}}
        />
    ).dive();

    const newUsername = 'bar';

    expect(wrapper.state().username).toEqual('');
    wrapper.instance().updateUsername(newUsername);
    expect(wrapper.state().username).toEqual(newUsername);
});

test('display error message if there is a `signInError`', () => {
    const wrapper = shallow(
        <SignIn
            signIn={props.signIn}
            signInError={props.signInError}
            onForgotPassword={() => {}}
        />
    ).dive();

    let errorMessage = shallow(wrapper.instance().errorMessage);
    expect(errorMessage.html()).toContain(props.signInError.message);
});

test('calls `onSignIn` when sign in button is pressed', () => {
    const signInSpy = jest.fn();
    const wrapper = mount(
        shallow(
            <SignIn
                signIn={signInSpy}
                classes={classes}
                onForgotPassword={() => {}}
            />
        ).get(0)
    );
    const signInForm = wrapper.find('form');
    signInForm
        .getElement()
        .props.onSubmit()
        .then(() => {
            expect(signInSpy).toHaveBeenCalled();
        });
});
