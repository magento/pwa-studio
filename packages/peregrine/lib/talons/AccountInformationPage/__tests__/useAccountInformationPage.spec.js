import React from 'react';
import { useQuery, useMutation } from '@apollo/client';

import createTestInstance from '../../../util/createTestInstance';
import { useAccountInformationPage } from '../useAccountInformationPage';

const mockSetCustomerInformation = jest.fn();
const mockChangeCustomerPassword = jest.fn();

jest.mock('@magento/peregrine/lib/context/user', () => {
    const state = {
        isSignedIn: true
    };
    const api = {};
    const useUserContext = jest.fn(() => [state, api]);

    return { useUserContext };
});

jest.mock('@apollo/client', () => ({
    useMutation: jest.fn().mockImplementation(mutation => {
        if (mutation === 'setCustomerInformationMutation')
            return [mockSetCustomerInformation, { loading: false }];

        if (mutation === 'changeCustomerPasswordMutation')
            return [mockChangeCustomerPassword, { loading: false }];

        return;
    }),
    useQuery: jest.fn().mockReturnValue({
        data: {
            customer: {
                id: null,
                firstname: 'Foo',
                lastname: 'Bar',
                email: 'foobar@express.net'
            }
        },
        error: null,
        loading: false
    })
}));

const Component = props => {
    const talonProps = useAccountInformationPage(props);
    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        tree.update(<Component {...{ ...props, ...newProps }} />);

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const mockProps = {
    mutations: {
        setCustomerInformationMutation: 'setCustomerInformationMutation',
        changeCustomerPasswordMutation: 'changeCustomerPasswordMutation'
    },
    queries: {
        getCustomerInformationQuery: 'getCustomerInformationQuery'
    }
};

test('return correct shape', () => {
    const { talonProps } = getTalonProps(mockProps);

    expect(talonProps).toMatchSnapshot();
});

test('returns updated data as initial values', () => {
    useMutation.mockReturnValueOnce([
        jest.fn(),
        {
            data: {
                updateCustomer: {
                    customer: 'FOO'
                }
            }
        }
    ]);
    const { talonProps } = getTalonProps(mockProps);

    expect(talonProps.initialValues).toMatchSnapshot();
});

test('return correct shape while data is loading', () => {
    useQuery.mockReturnValueOnce({
        loading: true
    });

    const { talonProps } = getTalonProps(mockProps);

    expect(talonProps).toMatchSnapshot();
});

test('handleChangePassword sets shouldShowNewPassword to true', () => {
    const { talonProps, update } = getTalonProps(mockProps);

    expect(talonProps).toMatchSnapshot();
    expect(talonProps.shouldShowNewPassword).toBe(false);

    talonProps.handleChangePassword();

    const newTalonProps = update();

    expect(newTalonProps.shouldShowNewPassword).toBe(true);
});

test('showUpdateMode sets isUpdateMode to true', () => {
    const { talonProps, update } = getTalonProps(mockProps);

    expect(talonProps).toMatchSnapshot();
    expect(talonProps.isUpdateMode).toBe(false);

    talonProps.showUpdateMode();

    const newTalonProps = update();

    expect(newTalonProps.isUpdateMode).toBe(true);
});

test('handleSubmit calls setCustomerInformationQuery', async () => {
    const { talonProps } = getTalonProps(mockProps);
    const { handleSubmit } = talonProps;

    await handleSubmit({
        firstname: 'Updated',
        lastname: 'Name',
        email: 'foobar@express.net',
        password: 'abc123'
    });

    expect(mockSetCustomerInformation).toHaveBeenCalled();
    expect(mockChangeCustomerPassword).not.toHaveBeenCalled();
    expect(mockSetCustomerInformation.mock.calls[0][0]).toMatchSnapshot();
});

test('handleSubmit calls changeCustomerPassword if new password is provided', async () => {
    const { talonProps } = getTalonProps(mockProps);
    const { handleSubmit } = talonProps;

    await handleSubmit({
        firstname: 'Updated',
        lastname: 'Bar',
        email: 'foobar@express.net',
        password: 'bar',
        newPassword: 'notBar'
    });

    expect(mockChangeCustomerPassword).toHaveBeenCalled();
    expect(mockChangeCustomerPassword.mock.calls[0][0]).toMatchSnapshot();
});

test('handleSubmit does not throw', async () => {
    const mockSetCustomerInformation = jest
        .fn()
        .mockRejectedValue(new Error('Async error'));
    useMutation.mockReturnValue([mockSetCustomerInformation, {}]);

    const { talonProps } = getTalonProps(mockProps);
    const { handleSubmit } = talonProps;

    expect(async () => {
        await handleSubmit({
            firstname: 'Updated',
            lastname: 'Bar',
            email: 'foobar@express.net',
            password: 'abc123'
        });
    }).not.toThrow();

    expect(mockSetCustomerInformation).toHaveBeenCalled();
    expect(mockChangeCustomerPassword).not.toHaveBeenCalled();
});
