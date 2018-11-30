import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SignIn from '../signIn';

configure({ adapter: new Adapter() });

const props = {
    signIn: function() {},
    signInError: { message: 'foo' }
};

const classes = {
    signInButton: 'a'
};

test('display error message if there is a `signInError`', () => {
    const wrapper = shallow(
        <SignIn signIn={props.signIn} signInError={props.signInError} />
    ).dive();

    let errorMessage = shallow(wrapper.instance().errorMessage);
    expect(errorMessage.html()).toContain(props.signInError.message);
});

test('calls `onSignIn` when sign in button is pressed', () => {
    const signInSpy = jest.fn();
    const wrapper = mount(
        shallow(<SignIn signIn={signInSpy} classes={classes} />).get(0)
    );
    const signInForm = wrapper.find('form');
    signInForm
        .getElement()
        .props.onSubmit()
        .then(() => {
            expect(signInSpy).toHaveBeenCalled();
        });
});
