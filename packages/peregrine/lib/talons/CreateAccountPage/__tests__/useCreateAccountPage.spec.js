import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useCreateAccountPage } from '../useCreateAccountPage';

const log = jest.fn();
const mockHistoryPush = jest.fn();
const mockLocationSearch = 'search';
const mockInitialValues = {
    email: null,
    firstName: null,
    lastName: null
};

let handleCreateAccountProp = null;
let handleOnCancelProp = null;

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        push: mockHistoryPush
    })),
    useLocation: jest.fn(() => ({ search: mockLocationSearch }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn(() => [{ isSignedIn: false }])
}));

let inputValues = {};

const Component = () => {
    const talonProps = useCreateAccountPage(inputValues);

    useEffect(() => {
        log(talonProps);
        handleCreateAccountProp = talonProps.handleCreateAccount;
        handleOnCancelProp = talonProps.handleOnCancel;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        createAccountRedirectUrl: 'url',
        signedInRedirectUrl: 'url',
        signInPageUrl: 'url'
    };
};

const givenUndefinedValues = () => {
    inputValues = {
        createAccountRedirectUrl: undefined,
        signedInRedirectUrl: undefined,
        signInPageUrl: undefined
    };
};

const givenSignedIn = () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
};

describe('#useCreateAccountPage', () => {
    beforeEach(() => {
        log.mockClear();
        handleCreateAccountProp = null;
        handleOnCancelProp = null;
        givenDefaultValues();
    });

    it('is redirected when user is signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('handles create account callback with defined url', () => {
        createTestInstance(<Component />);

        expect(typeof handleCreateAccountProp).toBe('function');

        act(() => {
            handleCreateAccountProp();
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleCreateAccount: expect.any(Function),
            handleOnCancel: expect.any(Function),
            initialValues: mockInitialValues
        });
    });

    it('handles create account callback without defined url', () => {
        givenUndefinedValues();
        createTestInstance(<Component />);

        expect(typeof handleCreateAccountProp).toBe('function');

        act(() => {
            handleCreateAccountProp();
        });

        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleCreateAccount: expect.any(Function),
            handleOnCancel: expect.any(Function),
            initialValues: mockInitialValues
        });
    });

    it('handles cancel callback with defined url', () => {
        createTestInstance(<Component />);

        expect(typeof handleOnCancelProp).toBe('function');

        act(() => {
            handleOnCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleCreateAccount: expect.any(Function),
            handleOnCancel: expect.any(Function),
            initialValues: mockInitialValues
        });
    });

    it('handles cancel callback without defined url', () => {
        givenUndefinedValues();
        createTestInstance(<Component />);

        expect(typeof handleOnCancelProp).toBe('function');

        act(() => {
            handleOnCancelProp();
        });

        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleCreateAccount: expect.any(Function),
            handleOnCancel: expect.any(Function),
            initialValues: mockInitialValues
        });
    });
});
