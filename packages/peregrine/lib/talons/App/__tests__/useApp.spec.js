import React from 'react';
import { useHistory } from 'react-router-dom';
import { createTestInstance } from '@magento/peregrine';
import errorRecord from '@magento/peregrine/lib/util/createErrorRecord';
import { act } from 'react-test-renderer';

import { useApp } from '../useApp';

import { useAppContext } from '@magento/peregrine/lib/context/app';

jest.mock('react-router-dom', () => ({
    useHistory: jest.fn()
}));
const reload = jest.fn();
useHistory.mockImplementation(() => ({
    go: reload
}));

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {
        drawerClosed: false,
        isOnline: true,
        hasBeenOffline: false,
        overlay: false
    };

    const api = {
        closeDrawer: jest.fn(() => {
            state.drawerClosed = true;
        }),
        setOnline: jest.fn(isOnline => {
            state.isOnline = isOnline;
        }),
        setHasBeenOffline: jest.fn(hasBeenOffline => {
            state.hasBeenOffline = hasBeenOffline;
        })
    };

    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

const log = jest.fn();
const Component = props => {
    const talonProps = useApp(props);
    log(talonProps);

    return <i />;
};

const handleError = jest.fn((error, id, loc, dismisser) => {
    dismisser();
});
const handleIsOffline = jest.fn();
const handleIsOnline = jest.fn();
const handleHTMLUpdate = jest.fn();
const markErrorHandled = jest.fn();
const renderError = undefined;
const unhandledErrors = [];
const mockProps = {
    handleError,
    handleIsOffline,
    handleIsOnline,
    handleHTMLUpdate,
    markErrorHandled,
    renderError,
    unhandledErrors
};

test('returns the correct shape', () => {
    createTestInstance(<Component {...mockProps} />);

    const talonProps = log.mock.calls[0][0];

    expect(talonProps).toMatchSnapshot();
});

test('handle render error', () => {
    const error = new Error('Render error');

    const props = {
        ...mockProps,
        renderError: error
    };

    createTestInstance(<Component {...props} />);

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(1);
});

test('handles unhandled errors', () => {
    const error1 = new Error('Error 1');
    const error2 = new Error('Error 2');
    const error3 = new Error('Error 3');

    const props = {
        ...mockProps,
        unhandledErrors: [
            errorRecord(error1, window, useApp, error1.stack),
            errorRecord(error2, window, useApp, error2.stack),
            errorRecord(error3, window, useApp, error3.stack)
        ]
    };

    const component = createTestInstance(<Component {...props} />);

    expect(markErrorHandled).toHaveBeenCalledTimes(3);
    expect(handleError).toHaveBeenCalledTimes(3);

    // Re-handle same error
    act(() => {
        const newProps = {
            ...mockProps,
            unhandledErrors: [errorRecord(error1, window, useApp, error1.stack)]
        };
        markErrorHandled.mockClear();
        handleError.mockClear();
        component.update(<Component {...newProps} />);
    });

    expect(markErrorHandled).toHaveBeenCalledTimes(1);
    expect(handleError).toHaveBeenCalledTimes(1);
});

test('handle render error in development environment', () => {
    const error = new Error('Render error');

    const props = {
        ...mockProps,
        renderError: error
    };

    process.env.NODE_ENV = 'development';

    createTestInstance(<Component {...props} />);

    expect(handleError).toHaveBeenCalledTimes(1);
    expect(reload).toHaveBeenCalledTimes(0);
});

test('handle drawer closing', () => {
    createTestInstance(<Component {...mockProps} />);

    const talonProps = log.mock.calls[0][0];

    const { handleCloseDrawer } = talonProps;

    const [appState] = useAppContext();

    expect(appState.drawerClosed).toBeFalsy();

    act(() => {
        handleCloseDrawer();
    });

    expect(appState.drawerClosed).toBeTruthy();
});

test('handle being offline to online event', () => {
    const [, appApi] = useAppContext();

    const { setOnline, setHasBeenOffline } = appApi;

    act(() => {
        setHasBeenOffline(true);
        setOnline(true);
        createTestInstance(<Component {...mockProps} />);
    });

    expect(handleIsOnline).toHaveBeenCalledTimes(1);
    expect(handleIsOffline).toHaveBeenCalledTimes(0);
});

test('handle being offline', () => {
    const [, appApi] = useAppContext();

    const { setOnline, setHasBeenOffline } = appApi;

    act(() => {
        setHasBeenOffline(true);
        setOnline(false);
        createTestInstance(<Component {...mockProps} />);
    });

    expect(handleIsOnline).toHaveBeenCalledTimes(0);
    expect(handleIsOffline).toHaveBeenCalledTimes(1);
});
