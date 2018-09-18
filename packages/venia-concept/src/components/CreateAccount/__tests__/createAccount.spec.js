import { createElement } from 'react';
import { configure, shallow } from 'enzyme';
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
        passwordConfirm: 'testa',
        subscribe: false,
        checkingEmail: false,
        emailAvailable: false,
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
        debounce: (cb) => {
            return cb;
        }
    }
});

jest.useFakeTimers();

test('correctly checks if password and passwordConfirm match', () => {
    const wrapper = shallow(
        <CreateAccount />
    ).dive();
    wrapper.setState(state);
    expect(wrapper.instance().passwordConfirmError).toBe(true);
    state.passwordConfirm = state.password;
    wrapper.setState(state);
    expect(wrapper.instance().passwordConfirmError).toBe(false);
});


test('account creation to be disabled if not all inputs are filled', () => {
    const wrapper = shallow(
        <CreateAccount />
    ).dive();
    wrapper.setState(blankState);
    expect(wrapper.instance().disableAccountCreation).toBe(true);
});

test('checks if email is available', () => {
    const wrapper = shallow(
        <CreateAccount />
    ).dive();
    wrapper.setState(state);
    wrapper.instance().checkEmail('test@test.com').then(() => {
        const { emailAvailable } = wrapper.instance().state;
        expect(emailAvailable).toBe(true);
        }
    );
});
