import React from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useAccountMenu } from '../useAccountMenu';
import createTestInstance from '../../../util/createTestInstance';
import { act } from 'react-test-renderer';
import { useEventingContext } from '@magento/peregrine/lib/context/eventing';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn().mockReturnValue({
        go: jest.fn()
    }),
    useLocation: jest.fn().mockReturnValue({
        pathname: '/'
    })
}));

jest.mock('@apollo/client', () => {
    const apolloClient = jest.requireActual('@apollo/client');
    return {
        ...apolloClient,
        useApolloClient: jest.fn().mockReturnValue({}),
        useMutation: jest
            .fn()
            .mockReturnValue([
                jest.fn(),
                { error: { graphQLErrors: [{ message: 'Signout Error' }] } }
            ])
    };
});

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn().mockReturnValue([
        {
            isSignedIn: true,
            currentUser: {
                __typename: 'Customer',
                email: 'roni_cost@example.com',
                firstname: 'Veronica',
                lastname: 'Costello',
                is_subscribed: false
            }
        },
        { signOut: jest.fn().mockResolvedValue() }
    ])
}));

jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => ({
    useDropdown: jest.fn().mockReturnValue({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded: jest.fn(),
        triggerRef: jest.fn()
    })
}));

jest.mock('@magento/peregrine/lib/context/eventing', () => ({
    useEventingContext: jest.fn().mockReturnValue([{}, { dispatch: jest.fn() }])
}));

const defaultProps = {
    isUserSignedIn: false,
    accountMenuIsOpen: false,
    setAccountMenuIsOpen: jest.fn()
};

const Component = props => {
    const talonProps = useAccountMenu(props);

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

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('handleForgotPassword should set view to FORGOT_PASSWORD', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleForgotPassword();

    const updatedTalonProps = update();

    expect(updatedTalonProps.view).toBe('FORGOT_PASSWORD');
});

test('handleCreateAccount should set view to CREATE_ACCOUNT', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleCreateAccount();

    const updatedTalonProps = update();

    expect(updatedTalonProps.view).toBe('CREATE_ACCOUNT');
});

test('handleCancel should set view back to SIGNIN', () => {
    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleCreateAccount();

    const updatedTalonProps = update();

    expect(updatedTalonProps.view).toBe('CREATE_ACCOUNT');

    updatedTalonProps.handleCancel();

    const finalProps = update();

    expect(finalProps.view).toBe('SIGNIN');
});

test('should change view to ACCOUNT if user is logged in', () => {
    useUserContext.mockReturnValueOnce([
        { isSignedIn: true },
        { signOut: jest.fn() }
    ]);

    const { update } = getTalonProps(defaultProps);

    const newTalonProps = update({
        accountMenuIsOpen: true
    });

    expect(newTalonProps.view).toBe('ACCOUNT');
});

test('setAccountMenuIsOpen should be called with false on mount', () => {
    const setAccountMenuIsOpen = jest.fn();

    getTalonProps({ ...defaultProps, setAccountMenuIsOpen });

    expect(setAccountMenuIsOpen).toHaveBeenCalledWith(false);
});

test('handleSignOut should set view to SIGNIN and dispatch appropriate event', async () => {
    const [, { dispatch: mockDispatch }] = useEventingContext();

    const { talonProps, update } = getTalonProps(defaultProps);

    await talonProps.handleSignOut();

    const updatedTalonProps = update();

    expect(updatedTalonProps.view).toBe('SIGNIN');

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch.mock.calls[0][0]).toMatchSnapshot();
});

test('handleSignOut should call setAccountMenuIsOpen with false', () => {
    const setAccountMenuIsOpen = jest.fn();

    const { talonProps } = getTalonProps({
        ...defaultProps,
        setAccountMenuIsOpen
    });

    talonProps.handleSignOut();

    expect(setAccountMenuIsOpen).toHaveBeenCalledWith(false);
});

test('handleAccoutCreation should set view to ACCOUNT', () => {
    useUserContext.mockReturnValueOnce([
        { isSignedIn: false },
        { signOut: jest.fn() }
    ]);

    const { talonProps, update } = getTalonProps(defaultProps);

    expect(talonProps.view).not.toBe('ACCOUNT');

    talonProps.handleAccountCreation();

    const updatedProps = update();

    expect(updatedProps.view).toBe('ACCOUNT');
});
