import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import CreateAccount from '../createAccount';

configure({ adapter: new Adapter() });

let blankState = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirm: '',
    subscribe: false,
    checkingEmail: false,
    emailAvailable: false,
    subscribe: true
};

let state = {
    firstName: 'Test',
    lastName: 'Test Test',
    email: 'test@test.com',
    password: 'test',
    passwordConfirm: 'test',
    subscribe: false,
    checkingEmail: false,
    emailAvailable: true,
    subscribe: true
};

jest.mock('@magento/peregrine', () => {
    return {
        RestApi: {
            Magento2: {
                request: () => {
                    return true;
                }
            }
        }
    };
});

jest.mock('underscore', () => {
    return {
        debounce: cb => {
            return cb;
        }
    };
});

const classes = {
    createAccountButton: 'a',
    root: 'b'
};

// jest.useFakeTimers();

test('correctly checks if password and passwordConfirm match', () => {
    const wrapper = shallow(<CreateAccount />).dive();
    wrapper.setState(state);
    expect(wrapper.instance().hasPasswordConfirmError).toBe(false);
    let incorrectPassState = Object.assign({}, state);
    incorrectPassState.passwordConfirm =
        incorrectPassState.passwordConfirm + 'wrong!';
    wrapper.setState(incorrectPassState);
    expect(wrapper.instance().hasPasswordConfirmError).toBe(true);
});

test('Enables the create account button when all forms are filled in and passwords match', () => {
    const wrapper = shallow(<CreateAccount />).dive();
    wrapper.setState(state);
    expect(wrapper.instance().isIncompleteOrInvalid).toBe(false);
});

test('checks if email is available', () => {
    const wrapper = shallow(<CreateAccount />).dive();
    const emailNotAvailable = Object.assign({ emailAvailable: false, state });
    wrapper.setState(emailNotAvailable);
    wrapper
        .instance()
        .checkEmail('test@test.com')
        .then(() => {
            const { emailAvailable } = wrapper.instance().state;
            expect(emailAvailable).toBe(true);
        });
});

test('account creation to be disabled if not all inputs are filled', () => {
    const wrapper = shallow(<CreateAccount />).dive();
    wrapper.setState(blankState);
    expect(wrapper.instance().isIncompleteOrInvalid).toBe(true);
});

test('calls `onCreateAccount` when create account button is pressed', () => {
    const createAccountSpy = jest.fn();
    const wrapper = mount(
        shallow(
            <CreateAccount createAccount={createAccountSpy} classes={classes} />
        ).get(0)
    );
    wrapper.setState(state);
    const createAccountForm = wrapper.find('form');
    createAccountForm
        .getElement()
        .props.onSubmit()
        .then(() => {
            expect(createAccountSpy).toHaveBeenCalled();
        });
});
