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
                firtname: 'Foo',
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

const mockProps = {
    mutations: {
        setCustomerInformationMutation: 'setCustomerInformationMutation',
        changeCustomerPasswordMutation: 'changeCustomerPasswordMutation'
    },
    queries: {
        getCustomerInformationQuery: 'getCustomerInformationQuery'
    }
};

test('return correct shape while data is loading', () => {
    useQuery.mockReturnValueOnce({
        loading: true
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('return correct shape for initial customer data', () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();
});

test('handleChangePassword sets shouldShowNewPassword to true', () => {});

test('showUpdateMode sets isUpdateMode to true', () => {});

test('handleSubmit calls setCustomerInformationQuery', async () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({
        firtname: 'Foo',
        lastname: 'Bar',
        email: 'foobar@express.net'
    });

    expect(mockSetCustomerInformation).toHaveBeenCalled();
    expect(mockChangeCustomerPassword).not.toHaveBeenCalled();
    expect(mockSetCustomerInformation.mock.calls[0][0]).toMatchSnapshot();
});

test('handleSubmit calls changeCustomerPassword if new password is provided', async () => {
    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    await handleSubmit({
        firtname: 'Foo',
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

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;
    const { handleSubmit } = talonProps;

    expect(async () => {
        await handleSubmit({
            firtname: 'Foo',
            lastname: 'Bar',
            email: 'foobar@express.net'
        });
    }).not.toThrow();

    expect(mockSetCustomerInformation).toHaveBeenCalled();
    expect(mockChangeCustomerPassword).not.toHaveBeenCalled();
});
