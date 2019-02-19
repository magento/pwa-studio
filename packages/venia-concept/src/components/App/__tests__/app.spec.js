import React from 'react';
import TestRenderer from 'react-test-renderer';

import OnlineIndicator from 'src/components/OnlineIndicator';
import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import ErrorNotifications from '../errorNotifications';

jest.mock('src/components/Main', () => 'Main');
jest.mock('src/components/MiniCart', () => 'MiniCart');
jest.mock('../errorNotifications', () => 'ErrorNotifications');

Object.defineProperty(window.location, 'reload', {
    configurable: true
});
window.location.reload = jest.fn();

// Use doMock so we can reference these mocks from the closure
let navigationError = false;
class Navigation extends React.Component {
    render() {
        if (navigationError) {
            throw new Error(navigationError);
        }
        return null;
    }
}
jest.doMock('src/components/Navigation', () => Navigation);
class Routes extends React.Component {
    render() {
        return null;
    }
}
jest.doMock('../renderRoutes', () => () => <Routes />);

// require app after mock is complete
const App = require('../app').default;

const getAndConfirmProps = (parent, type, props) => {
    const instance = parent.findByType(type);
    expect(instance.props).toMatchObject(props);
    return instance;
};

beforeEach(() => {
    jest.clearAllMocks();
    navigationError = false;
});
afterAll(() => window.location.reload.mockRestore());

test('renders a full page with onlineIndicator and routes', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };
    const { root } = TestRenderer.create(<App {...appProps} />);

    getAndConfirmProps(root, Navigation, { isOpen: false });
    getAndConfirmProps(root, MiniCart, { isOpen: false });

    const main = getAndConfirmProps(root, Main, {
        isMasked: false
    });

    // hasBeenOffline means onlineIndicator
    getAndConfirmProps(main, OnlineIndicator, { isOnline: false });
    // renderRoutes should just return a fake component here
    expect(main.findByType(Routes)).toBeTruthy();

    const mask = getAndConfirmProps(root, Mask, {
        isActive: false,
        dismiss: appProps.closeDrawer
    });

    // appropriate positioning
    const {
        parent: { children: siblings }
    } = main;
    const errorNotifications = getAndConfirmProps(root, ErrorNotifications, {
        errors: [],
        onDismissError: appProps.markErrorHandled
    });
    expect(siblings.indexOf(main)).toBeLessThan(siblings.indexOf(mask));
    expect(siblings.indexOf(errorNotifications)).toBeGreaterThan(
        siblings.indexOf(mask)
    );
});

test('renders error fallback UI if error is in state', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };

    navigationError = 'I broke';

    const { root } = TestRenderer.create(<App {...appProps} />);

    const main = getAndConfirmProps(root, Main, {
        isMasked: true
    });

    // No routes
    expect(() => main.findByType(Routes)).toThrow();

    const mask = getAndConfirmProps(root, Mask, {
        isActive: true
    });

    const errorNotifications = getAndConfirmProps(root, ErrorNotifications, {
        errors: expect.arrayContaining([
            expect.objectContaining({
                error: expect.any(Error)
            })
        ]),
        onDismissError: expect.any(Function)
    });

    expect(errorNotifications.props.errors[0].error.message).toMatch(
        navigationError
    );

    const {
        parent: { children: siblings }
    } = main;

    expect(siblings.indexOf(main)).toBeLessThan(siblings.indexOf(mask));
    expect(siblings.indexOf(errorNotifications)).toBeGreaterThan(
        siblings.indexOf(mask)
    );

    errorNotifications.props.onDismissError();
    expect(window.location.reload).toHaveBeenCalledTimes(1);
});

test('displays onlineIndicator online if hasBeenOffline', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: true
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };

    const { root } = TestRenderer.create(<App {...appProps} />);

    // hasBeenOffline means onlineIndicator
    getAndConfirmProps(root, OnlineIndicator, { isOnline: true });
});

test('displays no onlineIndicator if online state never changed', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: false,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };

    const { root } = TestRenderer.create(<App {...appProps} />);

    expect(() => root.findByType(OnlineIndicator)).toThrow();
});

test('displays open nav or drawer', () => {
    const propsWithDrawer = drawer => ({
        app: {
            drawer,
            overlay: false,
            hasBeenOffline: false,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    });

    const { root: openNav } = TestRenderer.create(
        <App {...propsWithDrawer('nav')} />
    );

    getAndConfirmProps(openNav, Navigation, { isOpen: true });

    const { root: openCart } = TestRenderer.create(
        <App {...propsWithDrawer('cart')} />
    );

    getAndConfirmProps(openCart, MiniCart, { isOpen: true });
});
