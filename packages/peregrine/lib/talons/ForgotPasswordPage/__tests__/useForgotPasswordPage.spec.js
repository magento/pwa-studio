import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useForgotPasswordPage } from '../useForgotPasswordPage';

const log = jest.fn();
const mockHistoryPush = jest.fn();
const mockUrl = '/url';
const mockForgotPasswordProps = {
    onCancel: expect.any(Function)
};

let onCancelProp;
let mockLocationState;
let mockLocationFrom;

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn(() => ({
        location: {
            state: mockLocationState
        },
        push: mockHistoryPush
    }))
}));

jest.mock('@magento/peregrine/lib/context/user', () => ({
    useUserContext: jest.fn(() => [{ isSignedIn: false }])
}));

let inputValues = {};

const Component = () => {
    const talonProps = useForgotPasswordPage(inputValues);

    useEffect(() => {
        log(talonProps);
        onCancelProp = talonProps.forgotPasswordProps.onCancel;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        signedInRedirectUrl: mockUrl,
        signInPageUrl: mockUrl
    };

    onCancelProp = null;
    mockLocationState = null;
    mockLocationFrom = null;
};

const givenUndefinedValues = () => {
    inputValues = {
        signedInRedirectUrl: undefined,
        signInPageUrl: undefined
    };
};

const givenFrom = () => {
    mockLocationFrom = '/from';
    mockLocationState = {
        from: mockLocationFrom
    };
};

const givenSignedIn = () => {
    useUserContext.mockReturnValueOnce([{ isSignedIn: true }]);
};

describe('#useForgotPasswordPage', () => {
    beforeEach(() => {
        log.mockClear();
        onCancelProp = null;
        givenDefaultValues();
    });

    it('is redirected to default url when user is signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalledWith(mockUrl);
    });

    it('handles cancel callback with defined url without previous state', () => {
        createTestInstance(<Component />);

        expect(typeof onCancelProp).toBe('function');

        act(() => {
            onCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalledWith(mockUrl, {});
        expect(log).toHaveBeenLastCalledWith({
            forgotPasswordProps: mockForgotPasswordProps
        });
    });

    it('handles cancel callback with defined url with previous state', () => {
        givenFrom();
        createTestInstance(<Component />);

        expect(typeof onCancelProp).toBe('function');

        act(() => {
            onCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalledWith(
            mockUrl,
            mockLocationState
        );
        expect(log).toHaveBeenLastCalledWith({
            forgotPasswordProps: mockForgotPasswordProps
        });
    });

    it('handles cancel callback without defined url', () => {
        givenUndefinedValues();
        createTestInstance(<Component />);

        expect(typeof onCancelProp).toBe('function');

        act(() => {
            onCancelProp();
        });

        expect(mockHistoryPush).not.toHaveBeenCalled();
        expect(log).toHaveBeenLastCalledWith({
            forgotPasswordProps: mockForgotPasswordProps
        });
    });
});
