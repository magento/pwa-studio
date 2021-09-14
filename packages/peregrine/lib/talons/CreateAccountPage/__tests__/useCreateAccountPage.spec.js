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
const mockUrl = '/url';
const mockCreateAccountProps = {
    initialValues: mockInitialValues,
    isCancelButtonHidden: false,
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
        onCancelProp = talonProps.createAccountProps.onCancel;
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

describe('#useCreateAccountPage', () => {
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

    it('is redirected to from url when user is signed in', () => {
        givenFrom();
        givenSignedIn();
        createTestInstance(<Component />);

        expect(mockHistoryPush).toHaveBeenCalledWith(mockLocationFrom);
    });

    it('is not redirected when user is signed in and url is not defined', () => {
        givenSignedIn();
        givenUndefinedValues();
        createTestInstance(<Component />);

        expect(mockHistoryPush).not.toHaveBeenCalled();
    });

    it('handles cancel callback with defined url without previous state', () => {
        createTestInstance(<Component />);

        expect(typeof onCancelProp).toBe('function');

        act(() => {
            onCancelProp();
        });

        expect(mockHistoryPush).toHaveBeenCalledWith(mockUrl, {});
        expect(log).toHaveBeenLastCalledWith({
            createAccountProps: mockCreateAccountProps
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
            createAccountProps: mockCreateAccountProps
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
            createAccountProps: mockCreateAccountProps
        });
    });
});
