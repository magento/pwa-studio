import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';
import { useMutation } from '@apollo/react-hooks';

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ])
}));
jest.mock('../../../util/formValidators');
jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = {
        isCreatingAccount: false,
        isSignedIn: false
    };
    const userApi = {
        signIn: jest.fn()
    };
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
    useMutation.mockImplementationOnce(() => [
        jest.fn(),
        {
            called: true,
            loading: false,
            error: null,
            data: {}
        }
    ]);

    const { root } = createTestInstance(<CreateAccount {...props} />);

    const form = root.findByType(Form);
    const { controller } = form.instance;
    await act(async () => {
        await form.props.onSubmit({
            customer: {
                email: 'test@example.com',
                firstname: 'tester',
                lastname: 'guy'
            },
            password: 'foo'
        });
        expect(props.onSubmit).toHaveBeenCalledTimes(1);
    });
    const { errors } = controller.state;

    expect(Object.keys(errors)).toHaveLength(0);
});
