import React, { useEffect } from 'react';
import { act } from 'react-test-renderer';

import { createTestInstance } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { useForgotPasswordPage } from '../useForgotPasswordPage';

const log = jest.fn();
const mockHistoryPush = jest.fn();

let handleOnCancelProp = null;

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
    const talonProps = useForgotPasswordPage(inputValues);

    useEffect(() => {
        log(talonProps);
        handleOnCancelProp = talonProps.handleOnCancel;
    }, [talonProps]);

    return null;
};

const givenDefaultValues = () => {
    inputValues = {
        signedInRedirectUrl: 'url',
        signInPageUrl: 'url'
    };
};

const givenUndefinedValues = () => {
    inputValues = {
        signedInRedirectUrl: undefined,
        signInPageUrl: undefined
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

    it('is redirected when user is signed in', () => {
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalled();
    });

    it('handles cancel callback with defined url', () => {
        createTestInstance(<Component />);

        expect(typeof handleOnCancelProp).toBe('function');

        act(() => {
            handleOnCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalled();
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
