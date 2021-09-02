import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useSignInPage } from '../useSignInPage';

const log = jest.fn();
const mockHistoryPush = jest.fn();

let handleShowCreateAccountProp = null;
let handleShowForgotPasswordProp = null;

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        push: mockHistoryPush
    }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn(() => [{ isSignedIn: false }])
}));

let inputValues = {};

const Component = () => {
    const talonProps = useSignInPage(inputValues);

    useEffect(() => {
        log(talonProps);
        handleShowCreateAccountProp = talonProps.handleShowCreateAccount;
        handleShowForgotPasswordProp = talonProps.handleShowForgotPassword;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        createAccountPageUrl: 'url',
        forgotPasswordPageUrl: 'url',
        signedInRedirectUrl: 'url'
    };
};

const givenUndefinedValues = () => {
    inputValues = {
        createAccountPageUrl: undefined,
        forgotPasswordPageUrl: undefined,
        signedInRedirectUrl: undefined
    };
};

const givenSignedIn = () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
};

describe('#useSignInPage', () => {
    beforeEach(() => {
        log.mockClear();
        handleShowCreateAccountProp = null;
        handleShowForgotPasswordProp = null;
        givenDefaultValues();
    });

    it('is redirected when user is signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('handles create account callback with defined url', () => {
        createTestInstance(<Component />);

        expect(typeof handleShowCreateAccountProp).toBe('function');

        act(() => {
            handleShowCreateAccountProp();
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleShowCreateAccount: expect.any(Function),
            handleShowForgotPassword: expect.any(Function)
        });
    });

    it('handles create account callback without defined url', () => {
        givenUndefinedValues();
        createTestInstance(<Component />);

        expect(typeof handleShowCreateAccountProp).toBe('function');

        act(() => {
            handleShowCreateAccountProp();
        });

        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleShowCreateAccount: expect.any(Function),
            handleShowForgotPassword: expect.any(Function)
        });
    });

    it('handles forgot password callback with defined url', () => {
        createTestInstance(<Component />);

        expect(typeof handleShowForgotPasswordProp).toBe('function');

        act(() => {
            handleShowForgotPasswordProp();
        });

        expect(mockHistoryPush).toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleShowCreateAccount: expect.any(Function),
            handleShowForgotPassword: expect.any(Function)
        });
    });

    it('handles forgot password callback without defined url', () => {
        givenUndefinedValues();
        createTestInstance(<Component />);

        expect(typeof handleShowForgotPasswordProp).toBe('function');

        act(() => {
            handleShowForgotPasswordProp();
        });

        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            handleShowCreateAccount: expect.any(Function),
            handleShowForgotPassword: expect.any(Function)
        });
    });
});
