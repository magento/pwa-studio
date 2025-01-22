import React from 'react';
import { useApolloClient, useQuery, useMutation } from '@apollo/client';
import { act } from '@testing-library/react-hooks';
import createTestInstance from '../../../util/createTestInstance';
import { useUserContext } from '../../../context/user';
import { useSignIn } from '../useSignIn';
import { useAwaitQuery } from '../../../hooks/useAwaitQuery';

jest.mock('@apollo/client', () => {
    return {
        ...jest.requireActual('@apollo/client'),
        useApolloClient: jest.fn(),
        useMutation: jest.fn().mockReturnValue([jest.fn()]),
        useQuery: jest.fn()
    };
});
jest.mock('../../../hooks/useAwaitQuery', () => ({
    useAwaitQuery: jest.fn()
}));
jest.mock('../../../store/actions/cart', () => ({
    retrieveCartId: jest.fn().mockReturnValue('new-cart-id')
}));

jest.mock('../../../../lib/context/cart', () => ({
    useCartContext: jest.fn().mockReturnValue([
        { cartId: '1234' },
        {
            createCart: jest.fn(),
            removeCart: jest.fn(),
            getCartDetails: jest.fn()
        }
    ])
}));

jest.mock('../../../../lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([
        {
            isGettingDetails: false,
            getDetailsError: 'getDetails error from redux'
        },
        { getUserDetails: jest.fn(), setToken: jest.fn() }
    ])
}));
jest.mock('../../../hooks/useGoogleReCaptcha', () => ({
    useGoogleReCaptcha: jest.fn().mockReturnValue({
        recaptchaLoading: false,
        generateReCaptchaData: jest.fn(() => {}),
        recaptchaWidgetProps: {}
    })
}));

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn().mockReturnValue({
        push: jest.fn(),

        replace: jest.fn()
    }),

    useLocation: jest.fn().mockReturnValue({
        pathname: '/checkout',

        search: '',

        hash: '',

        state: null
    })
}));

const Component = props => {
    const talonProps = useSignIn(props);

    return <i talonProps={talonProps} />;
};

const getTalonProps = props => {
    const tree = createTestInstance(<Component {...props} />);
    const { root } = tree;
    const { talonProps } = root.findByType('i').props;

    const update = newProps => {
        act(() => {
            tree.update(<Component {...{ ...props, ...newProps }} />);
        });

        return root.findByType('i').props.talonProps;
    };

    return { talonProps, tree, update };
};

const signInVariables = {
    email: 'fry@planetexpress.com',
    password: 'slurm is the best'
};

const getCartDetailsQuery = 'getCartDetailsQuery';
const getCustomerQuery = 'getCustomerQuery';
const createCartMutation = 'createCartMutation';
const signInMutation = 'signInMutation';
const mergeCartsMutation = 'mergeCartsMutation';
const getStoreConfigQuery = 'getStoreConfigQuery';

const getCartDetailsQueryFn = jest.fn();
const customerQueryFn = jest.fn();
const mergeCartsMutationFn = jest.fn().mockReturnValue([jest.fn()]);
const getStoreConfigQueryFn = jest.fn().mockReturnValue({
    data: {
        storeConfig: {
            store_code: 'default',
            customer_access_token_lifetime: 1
        }
    }
});
const signInMutationFn = jest.fn().mockReturnValue([
    jest.fn().mockReturnValue({
        data: {
            generateCustomerToken: {
                token: 'customer token'
            }
        }
    }),
    { error: null }
]);

const defaultProps = {
    operations: {
        createCartMutation,
        getCustomerQuery,
        mergeCartsMutation,
        signInMutation,
        getStoreConfigQuery
    },
    getCartDetailsQuery: jest.fn(),
    setDefaultUsername: jest.fn(),
    showCreateAccount: jest.fn(),
    showForgotPassword: jest.fn(),
    handleTriggerClick: jest.fn()
};

const clearCacheData = jest.fn();
const client = { clearCacheData };

beforeEach(() => {
    useQuery.mockImplementation(query => {
        if (query === getStoreConfigQuery) {
            return getStoreConfigQueryFn();
        } else {
            return [jest.fn(), {}];
        }
    });
    useAwaitQuery.mockImplementation(query => {
        if (query === getCustomerQuery) {
            return customerQueryFn();
        } else if (query === getCartDetailsQuery) {
            return getCartDetailsQueryFn();
        } else {
            return jest.fn();
        }
    });
    useMutation.mockImplementation(mutation => {
        if (mutation === signInMutation) {
            return signInMutationFn();
        } else if (mutation === mergeCartsMutation) {
            return mergeCartsMutationFn();
        } else {
            return [jest.fn()];
        }
    });
    useApolloClient.mockReturnValue(client);
});

test('returns correct shape', () => {
    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    expect(talonProps).toMatchSnapshot();
});
test('should set isBusy to true', () => {
    const { talonProps, update } = getTalonProps({
        ...defaultProps
    });
    talonProps.handleSubmit(signInVariables);

    const { isBusy } = update();

    expect(isBusy).toBeTruthy();
});

test('handleSubmit triggers waterfall of operations and actions', async () => {
    const token = 'customertoken';
    const customer_token_lifetime = 1;
    const signIn = jest.fn().mockReturnValue({
        data: {
            generateCustomerToken: {
                token
            }
        }
    });
    signInMutationFn.mockReturnValueOnce([signIn, { error: null }]);
    const setToken = jest.fn();
    useUserContext.mockReturnValueOnce([
        { isGettingDetails: false },
        { getUserDetails: jest.fn(), setToken }
    ]);

    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    await talonProps.handleSubmit(signInVariables);
    expect(signIn).toHaveBeenCalledWith({
        variables: {
            email: signInVariables.email,
            password: signInVariables.password
        }
    });
    expect(setToken).toHaveBeenCalledWith(token, customer_token_lifetime);
});

test('handleSubmit exception is logged and resets state', async () => {
    const fetchUserDetails = jest.fn();
    customerQueryFn.mockReturnValueOnce(fetchUserDetails);
    const getUserDetails = jest.fn();
    useUserContext.mockReturnValueOnce([
        { isGettingDetails: false },
        { getUserDetails: jest.fn(), setToken: jest.fn() }
    ]);

    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    expect(talonProps.isBusy).toBeFalsy();
    expect(getUserDetails).not.toHaveBeenCalled();
});

test('handleForgotPassword triggers callbacks', async () => {
    const setDefaultUsername = jest.fn();
    const showForgotPassword = jest.fn();
    const { talonProps } = getTalonProps({
        ...defaultProps,
        setDefaultUsername,
        showForgotPassword
    });
    const mockUsername = 'fry@planetexpress.com';
    const mockApi = {
        getValue: jest.fn().mockReturnValue(mockUsername)
    };
    await talonProps.setFormApi(mockApi);
    await talonProps.handleForgotPassword();
    expect(setDefaultUsername).toHaveBeenCalledWith(mockUsername);
    expect(showForgotPassword).toHaveBeenCalled();
});

test('handleCreateAccount triggers callbacks', async () => {
    const setDefaultUsername = jest.fn();
    const showCreateAccount = jest.fn();
    const { talonProps } = getTalonProps({
        ...defaultProps,
        setDefaultUsername,
        showCreateAccount
    });
    const mockUsername = 'fry@planetexpress.com';
    const mockApi = {
        getValue: jest.fn().mockReturnValue(mockUsername)
    };
    await talonProps.setFormApi(mockApi);
    await talonProps.handleCreateAccount();
    expect(setDefaultUsername).toHaveBeenCalledWith(mockUsername);
    expect(showCreateAccount).toHaveBeenCalled();
});

test('mutation error is returned by talon', async () => {
    const getUserDetailsQuery = jest.fn();
    getUserDetailsQuery.mockReturnValueOnce([
        jest.fn(),
        { error: 'getDetails error from redux' }
    ]);
    signInMutationFn.mockReturnValueOnce([
        jest.fn(),
        { error: 'Sign In Mutation Error' }
    ]);

    const { talonProps } = getTalonProps({
        ...defaultProps
    });

    await talonProps.handleSubmit(signInVariables);
    expect(talonProps.errors).toMatchSnapshot();
});

test('useLocation and useHistory are used correctly', () => {
    const { talonProps } = getTalonProps({ ...defaultProps });

    expect(talonProps).toBeDefined(); // Placeholder assertion.
});

it('should call handleForgotPassword when Enter key is pressed', () => {
    const { talonProps } = getTalonProps({
        ...defaultProps
    });
    const enterKeyEvent = { key: 'Enter' };
    talonProps.forgotPasswordHandleEnterKeyPress(enterKeyEvent);
});
