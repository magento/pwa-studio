import React from 'react';
import { act } from 'react-test-renderer';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';

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
    const { root } = createTestInstance(<CreateAccount {...props} />);

    const form = root.findByType(Form);
    const { formApi } = form.instance;

    // touch fields, call validators, call onSubmit
    await act(() => {
        formApi.submitForm();
    });

    const { errors } = root.findByType(Form).instance.controller.state;

    expect(Object.keys(errors)).toHaveLength(0);
    expect(props.onSubmit).toHaveBeenCalledTimes(1);
});
