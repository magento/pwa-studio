import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useSignInPage } from '../useSignInPage';

const log = jest.fn();
const mockHistoryPush = jest.fn();
const mockUrl = '/url';
let mockLocationFrom = null;

let handleShowCreateAccountProp = null;
let handleShowForgotPasswordProp = null;

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        location: {
            state: {
                from: mockLocationFrom
            }
        },
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
        createAccountPageUrl: mockUrl,
        forgotPasswordPageUrl: mockUrl,
        signedInRedirectUrl: mockUrl
    };
};

const givenUndefinedValues = () => {
    inputValues = {
        createAccountPageUrl: undefined,
        forgotPasswordPageUrl: undefined,
        signedInRedirectUrl: undefined
    };
};

const givenFrom = () => {
    mockLocationFrom = '/from';
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

    it('is redirected to default url when user is signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalledWith(mockUrl);
    });

    it('is redirected to from url when user is signed in', () => {
        givenFrom();
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalledWith(mockLocationFrom);
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
