import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { act } from 'react-test-renderer';

import { useApp } from '../useApp';

import { useAppContext } from '@magento/peregrine/lib/context/app';

const handleError = jest.fn((error, id, loc, dismisser) => {
    dismisser();
});
const handleIsOffline = jest.fn();
const handleIsOnline = jest.fn();
const handleHTMLUpdate = jest.fn();
const markErrorHandled = jest.fn(error => {});
const renderError = {};
const unhandledErrors = [];

const reload = jest.fn();

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {
        drawerClosed: false
    };

    const api = {
        closeDrawer: jest.fn(() => {
            state.drawerClosed = true
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

const mockProps = {
    handleError,
    handleIsOffline,
    handleIsOnline,
    handleHTMLUpdate,
    markErrorHandled,
    renderError,
    unhandledErrors
};

// JSDom does not support navigation, so it needs to be mocked
const mockWindowLocation = {
    reload: reload
};

let oldWindowLocation;
beforeEach(() => {
    oldWindowLocation = window.location;
    delete window.location;
    window.location = mockWindowLocation;
    mockWindowLocation.reload.mockClear();
});
afterEach(() => {
    window.location = oldWindowLocation;
});

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
