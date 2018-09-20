import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import SignIn from '../signIn';

configure({ adapter: new Adapter() });

const props = {
    signIn: function() {},
    signInError: { message: 'foo' }
};

test('set state `password` to new `password` on `updatePassword`', () => {
    const wrapper = shallow(
        <SignIn signIn={props.signIn} signInError={props.signInError} />
    ).dive();

    const newPassword = 'foo';

    expect(wrapper.state().password).toEqual('');
    wrapper.instance().updatePassword(newPassword);
    expect(wrapper.state().password).toEqual(newPassword);
});

test('set state `username` to new `username` on `updateUsername`', () => {
    const wrapper = shallow(
        <SignIn signIn={props.signIn} signInError={props.signInError} />
    ).dive();

    const newUsername = 'bar';

    expect(wrapper.state().username).toEqual('');
    wrapper.instance().updateUsername(newUsername);
    expect(wrapper.state().username).toEqual(newUsername);
});

test('display error message if there is a `signInError`', () => {
    const wrapper = shallow(
        <SignIn signIn={props.signIn} signInError={props.signInError} />
    ).dive();

    let errorMessage = shallow(wrapper.instance().errorMessage);
    expect(errorMessage.html()).toContain(props.signInError.message);
});
