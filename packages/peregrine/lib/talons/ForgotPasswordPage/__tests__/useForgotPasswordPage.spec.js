import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useForgotPasswordPage } from '../useForgotPasswordPage';

const log = jest.fn();
const mockHistoryPush = jest.fn();
const mockUrl = '/url';

let handleOnCancelProp;
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
        handleOnCancelProp = talonProps.handleOnCancel;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        signedInRedirectUrl: mockUrl,
        signInPageUrl: mockUrl
    };

    handleOnCancelProp = null;
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
        handleOnCancelProp = null;
        givenDefaultValues();
    });

    it('is redirected to default url when user is signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalledWith(mockUrl);
    });

    it('handles cancel callback with defined url without previous state', () => {
        createTestInstance(<Component />);

        expect(typeof handleOnCancelProp).toBe('function');

        act(() => {
            handleOnCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalledWith(mockUrl, {});
        expect(log).toHaveBeenLastCalledWith({
            handleOnCancel: expect.any(Function)
        });
    });

    it('handles cancel callback with defined url with previous state', () => {
        givenFrom();
        createTestInstance(<Component />);

        expect(typeof handleOnCancelProp).toBe('function');

        act(() => {
            handleOnCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalledWith(
            mockUrl,
            mockLocationState
        );
        expect(log).toHaveBeenLastCalledWith({
            handleOnCancel: expect.any(Function)
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
            handleOnCancel: expect.any(Function)
        });
    });
});
