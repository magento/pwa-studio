import React from 'react';
import { createTestInstance, ToastContextProvider } from '@magento/peregrine';

import Main from 'src/components/Main';
import Mask from 'src/components/Mask';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';

jest.mock('src/components/Main', () => 'Main');
jest.mock('src/components/MiniCart', () => 'MiniCart');
jest.mock('src/components/Navigation', () => 'Navigation');
Object.defineProperty(window.location, 'reload', {
    configurable: true
});
window.location.reload = jest.fn();

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
    const { root } = createTestInstance(
        <ToastContextProvider>
            <App {...appProps} />
        </ToastContextProvider>
    );

    getAndConfirmProps(root, Navigation, { isOpen: false });
    getAndConfirmProps(root, MiniCart, { isOpen: false });

    const main = getAndConfirmProps(root, Main, {
        isMasked: false
    });

    // hasBeenOffline means onlineIndicator
    getAndConfirmProps(root, Main, { isOnline: false });
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
    expect(siblings.indexOf(main)).toBeLessThan(siblings.indexOf(mask));
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

    const { root } = createTestInstance(
        <ToastContextProvider>
            <App {...appProps} />
        </ToastContextProvider>
    );
    // hasBeenOffline means onlineIndicator
    getAndConfirmProps(root, Main, { isOnline: true });
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

    const { root: openNav } = createTestInstance(
        <ToastContextProvider>
            <App {...propsWithDrawer('nav')} />
        </ToastContextProvider>
    );

    getAndConfirmProps(openNav, Navigation, { isOpen: true });

    const { root: openCart } = createTestInstance(
        <ToastContextProvider>
            <App {...propsWithDrawer('cart')} />
        </ToastContextProvider>
    );

    getAndConfirmProps(openCart, MiniCart, { isOpen: true });
});

test.skip('adds toasts for render errors', () => {});
test.skip('adds toasts for unhandled errors', () => {});
