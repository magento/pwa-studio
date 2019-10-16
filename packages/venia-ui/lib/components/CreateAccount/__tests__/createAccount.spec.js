import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';
import { useLazyQuery } from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => ({
    useLazyQuery: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            called: false,
            loading: false,
            error: null,
            data: null
        }
    ])
}));
jest.mock('../../../util/formValidators');
jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = {
        createAccountError: null,
        isCreatingAccount: false,
        isSignedIn: false
    };
    const userApi = {};
    const useUserContext = jest.fn(() => [userState, userApi]);

    return { useUserContext };
});

const props = {
    onSubmit: jest.fn()
};

test('renders the correct tree', () => {
    const tree = createTestInstance(<CreateAccount {...props} />).toJSON();

    expect(tree).toMatchSnapshot();
});

test('attaches the submit handler', () => {
    const { root } = createTestInstance(<CreateAccount {...props} />);

    const { onSubmit } = root.findByType(Form).props;

    expect(typeof onSubmit).toBe('function');
});

test('calls onSubmit if validation passes', async () => {
    useLazyQuery.mockImplementationOnce(() => [
        jest.fn(),
        {
            called: true,
            loading: false,
            error: null,
            data: { isEmailAvailable: { is_email_available: true } }
        }
    ]);

    const { root } = createTestInstance(<CreateAccount {...props} />);

    const { errors } = root.findByType(Form).instance.controller.state;

    expect(Object.keys(errors)).toHaveLength(0);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
});

test('does not call onSubmit if email is unavailable', () => {
    useLazyQuery.mockImplementationOnce(() => [
        jest.fn(),
        {
            called: true,
            loading: false,
            error: null,
            data: { isEmailAvailable: { is_email_available: false } }
        }
    ]);

    const { root } = createTestInstance(<CreateAccount {...props} />);

    const { errors } = root.findByType(Form).instance.controller.state;

    expect(Object.keys(errors)).toHaveLength(0);
    expect(props.onSubmit).toHaveBeenCalledTimes(0);
});
