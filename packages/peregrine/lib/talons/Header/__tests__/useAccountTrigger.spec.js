import React from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';

import { useAccountTrigger } from '../useAccountTrigger';
import createTestInstance from '../../../util/createTestInstance';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn().mockReturnValue({
        go: jest.fn()
    }),
    useLocation: jest.fn().mockReturnValue({
        pathname: '/'
    })
}));

jest.mock('@apollo/react-hooks', () => ({
    useApolloClient: jest.fn().mockReturnValue({}),
    useMutation: jest
        .fn()
        .mockReturnValue([
            jest.fn(),
            { error: { graphQLErrors: [{ message: 'Signout Error' }] } }
        ])
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest
        .fn()
        .mockReturnValue([{ isSignedIn: false }, { signOut: jest.fn() }])
}));

jest.mock('@magento/peregrine/lib/hooks/useDropdown', () => ({
    useDropdown: jest.fn().mockReturnValue({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded: jest.fn(),
        triggerRef: jest.fn()
    })
}));

jest.mock('@magento/peregrine/lib/Apollo/clearCartDataFromCache', () =>
    jest.fn()
);

jest.mock('@magento/peregrine/lib/Apollo/clearCustomerDataFromCache', () =>
    jest.fn()
);

const defaultProps = {
    VIEWS: {
        SIGNIN: 'SIGNIN',
        FORGOT_PASSWORD: 'FORGOT_PASSWORD',
        CREATE_ACCOUNT: 'CREATE_ACCOUNT',
        ACCOUNT: 'ACCOUNT'
    },
    mutations: {
        signOut: 'signOutMutation'
    }
};

const Component = props => {
    const talonProps = useAccountTrigger(props);

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

test('should return correct shape', () => {
    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps).toMatchSnapshot();
});

test('handleTriggerClick should set view to SIGNIN if user is not signed in', () => {
    useUserContext.mockReturnValueOnce([
        { isSignedIn: false },
        { signOut: jest.fn() }
    ]);

    const { talonProps, update } = getTalonProps(defaultProps);

    talonProps.handleTriggerClick();

    const updatedTalonProps = update();

    expect(updatedTalonProps.view).toBe('SIGNIN');
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

test('should change view to ACCOUNT if user is logged in', () => {
    useUserContext.mockReturnValueOnce([
        { isSignedIn: true },
        { signOut: jest.fn() }
    ]);

    const { talonProps } = getTalonProps(defaultProps);

    expect(talonProps.view).toBe('ACCOUNT');
});

test('setAccountMenuIsOpen should be called with false on mount', () => {
    const setExpanded = jest.fn();

    useDropdown.mockReturnValueOnce({
        elementRef: 'elementRef',
        expanded: false,
        setExpanded,
        triggerRef: jest.fn()
    });

    getTalonProps(defaultProps);

    expect(setExpanded).toHaveBeenCalledWith(false);
});
