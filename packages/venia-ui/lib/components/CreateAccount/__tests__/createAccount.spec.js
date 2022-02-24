import React from 'react';
import { Form } from 'informed';
import { createTestInstance } from '@magento/peregrine';

import CreateAccount from '../createAccount';

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
        data: {},
        loading: false,
        error: null
    }))
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
