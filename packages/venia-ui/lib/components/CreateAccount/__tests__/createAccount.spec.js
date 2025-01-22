import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';

import { useHistory, useLocation } from 'react-router-dom';

jest.mock('@apollo/client', () => ({
    gql: jest.fn(),
    useApolloClient: jest.fn().mockImplementation(() => {}),
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn(),
        {
            error: null
        }
    ]),
    useQuery: jest.fn().mockImplementation(() => ({
        data: {
            storeConfig: {
                minimum_password_length: 8 // or whatever value is expected
            }
        },
        loading: false,
        error: null
    }))
}));

// Mocking the react-router hooks

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),

    useHistory: jest.fn(),

    useLocation: jest.fn()
}));

jest.mock('../../../util/formValidators');
jest.mock('@magento/peregrine/lib/context/user', () => {
    const userState = {
        isGettingDetails: false
    };
    const userApi = {
        getUserDetails: jest.fn(),
        setToken: jest.fn()
    };
    const useUserContext = jest.fn(() => [userState, userApi]);

    return { useUserContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {};
    const api = {
        createCart: jest.fn(),
        getCartDetails: jest.fn(),
        removeCart: jest.fn()
    };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/hooks/useAwaitQuery', () => {
    const useAwaitQuery = jest
        .fn()
        .mockResolvedValue({ data: { customer: {} } });

    return { useAwaitQuery };
});

// Mocking useLocation and useHistory for the tests

beforeEach(() => {
    useHistory.mockReturnValue({
        push: jest.fn() // mock any methods you need from useHistory
    });

    useLocation.mockReturnValue({
        pathname: '/mock-path', // mock the location properties

        search: '',

        hash: '',

        state: null
    });
});

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

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

test('should not render cancel button if isCancelButtonHidden is true', () => {
    const tree = createTestInstance(
        <CreateAccount {...props} isCancelButtonHidden={true} />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});
