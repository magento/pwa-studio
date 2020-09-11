import React from 'react';
import { useQuery } from '@apollo/client';

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

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {};
    const api = {
        toggleDrawer: jest.fn(),
        closeDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
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

test('return correct shape for new value and fire create mutation update customer information', async () => {
    useQuery.mockReturnValueOnce({
        data: {
            customer: {
                id: 7,
                firtname: 'Bar',
                lastname: 'Foo',
                email: 'barfoo@express.net'
            }
        },
        error: null,
        loading: true
    });

    const tree = createTestInstance(<Component {...mockProps} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    expect(talonProps).toMatchSnapshot();

    const { handleSubmit } = talonProps;

    await handleSubmit({
        firtname: 'Foo',
        lastname: 'Bar',
        email: 'foobar@express.net'
    });

    expect(mockSetCustomerInformation).toHaveBeenCalled();
    expect(mockSetCustomerInformation.mock.calls[0][0]).toMatchSnapshot();
});
