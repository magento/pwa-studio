import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import Main from '../../Main';
import Mask from '../../Mask';
import Navigation from '../../Navigation';
import Routes from '../../Routes';

jest.mock('../../Head', () => ({
    HeadProvider: ({ children }) => <div>{children}</div>,
    Title: () => 'Title'
}));
jest.mock('../../Main', () => 'Main');
jest.mock('../../Navigation', () => 'Navigation');
jest.mock('../../Routes', () => 'Routes');
jest.mock('../../ToastContainer', () => 'ToastContainer');

const mockAddToast = jest.fn();
jest.mock('@magento/peregrine', () => {
    const useToasts = jest.fn(() => [
        { toasts: new Map() },
        { addToast: mockAddToast }
    ]);

    return {
        ...jest.requireActual('@magento/peregrine'),
        useToasts
    };
});

jest.mock('@magento/peregrine/lib/context/app', () => {
    const state = {
        hasBeenOffline: false,
        isOnline: true,
        overlay: false,
        drawer: null
    };
    const api = {
        closeDrawer: jest.fn()
    };
    const useAppContext = jest.fn(() => [state, api]);

    return { useAppContext };
});

jest.mock('@magento/peregrine/lib/context/checkout', () => {
    const state = {};
    const api = {
        actions: {
            reset: jest.fn()
        }
    };
    const useCheckoutContext = jest.fn(() => [state, api]);

    return { useCheckoutContext };
});

jest.mock('@magento/peregrine/lib/context/cart', () => {
    const state = {
        cartId: null
    };
    const api = {
        getCartDetails: jest.fn(),
        setCartId: id => {
            state.cartId = id;
        }
    };
    const useCartContext = jest.fn(() => [state, api]);

    return { useCartContext };
});

jest.mock('@magento/peregrine/lib/util/createErrorRecord', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        error: { message: 'A render error', stack: 'errorStack' },
        id: '1',
        loc: '1'
    })
}));

jest.mock('@apollo/react-hooks', () => ({
    useMutation: jest.fn().mockImplementation(() => [
        jest.fn().mockImplementation(() => {
            return {
                data: {
                    createEmptyCart: 'cartIdFromGraphQL'
                }
            };
        })
    ])
}));

// require app after mock is complete
const App = require('../app').default;

const getAndConfirmProps = (parent, type, props = {}) => {
    const instance = parent.findByType(type);
    expect(instance.props).toMatchObject(props);
    return instance;
};

beforeAll(() => {
    global.STORE_NAME = 'Venia';
});

const mockWindowLocation = {
    reload: jest.fn()
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

test('renders a full page with onlineIndicator and routes', () => {
    const [appState, appApi] = useAppContext();
    const mockedReturnValue = [
        {
            ...appState,
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        appApi
    ];

    useAppContext.mockReturnValueOnce(mockedReturnValue);

    const appProps = {
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };
    const { root } = createTestInstance(<App {...appProps} />);

    getAndConfirmProps(root, Navigation);

    const main = getAndConfirmProps(root, Main, {
        isMasked: false
    });

    expect(mockAddToast).toHaveBeenCalledWith({
        type: 'error',
        icon: expect.any(Object),
        message: 'You are offline. Some features may be unavailable.',
        timeout: 3000
    });
    // renderRoutes should just return a fake component here
    expect(main.findByType(Routes)).toBeTruthy();

    const mask = getAndConfirmProps(root, Mask, {
        isActive: false,
        dismiss: expect.any(Function)
    });

    // appropriate positioning
    const {
        parent: { children: siblings }
    } = main;
    expect(siblings.indexOf(main)).toBeLessThan(siblings.indexOf(mask));
});

test('displays onlineIndicator online if hasBeenOffline', () => {
    const [appState, appApi] = useAppContext();
    const mockedReturnValue = [
        {
            ...appState,
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: true
        },
        appApi
    ];

    useAppContext.mockReturnValueOnce(mockedReturnValue);

    const appProps = {
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };

    createTestInstance(<App {...appProps} />);
    expect(mockAddToast).toHaveBeenCalledWith({
        type: 'info',
        icon: expect.any(Object),
        message: 'You are online.',
        timeout: 3000
    });
});

test('displays open nav or drawer', () => {
    const [appState, appApi] = useAppContext();
    useAppContext
        .mockReturnValueOnce([
            {
                ...appState,
                drawer: 'nav',
                overlay: false,
                hasBeenOffline: true,
                isOnline: true
            },
            appApi
        ])
        .mockReturnValueOnce([
            {
                ...appState,
                drawer: 'cart',
                overlay: false,
                hasBeenOffline: true,
                isOnline: true
            },
            appApi
        ]);
    const props = {
        markErrorHandled: jest.fn(),
        unhandledErrors: []
    };

    const { root: openNav } = createTestInstance(<App {...props} />);

    getAndConfirmProps(openNav, Navigation);
});

test('renders with renderErrors', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: [],
        renderError: new Error('A render error!')
    };

    const { root } = createTestInstance(<App {...appProps} />);

    expect(root).toMatchSnapshot();
});

test('renders with unhandledErrors', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: [{ error: new Error('A render error!') }],
        renderError: null
    };

    const { root } = createTestInstance(<App {...appProps} />);

    expect(root).toMatchSnapshot();
});

test('adds no toasts when no errors are present', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: false,
            isOnline: true
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: [],
        renderError: null
    };

    createTestInstance(<App {...appProps} />);

    expect(mockAddToast).not.toHaveBeenCalled();
});

test('adds toasts for render errors', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: [],
        renderError: new Error('A render error!')
    };

    createTestInstance(<App {...appProps} />);

    expect(mockAddToast).toHaveBeenCalledWith({
        icon: expect.any(Object),
        message: expect.any(String),
        onDismiss: expect.any(Function),
        timeout: expect.any(Number),
        type: 'error'
    });
});

test('adds toasts for unhandled errors', () => {
    const appProps = {
        app: {
            drawer: '',
            overlay: false,
            hasBeenOffline: true,
            isOnline: false
        },
        closeDrawer: jest.fn(),
        markErrorHandled: jest.fn(),
        unhandledErrors: [{ error: new Error('A render error!') }],
        renderError: null
    };

    createTestInstance(<App {...appProps} />);

    expect(mockAddToast).toHaveBeenCalledWith({
        icon: expect.any(Object),
        message: expect.any(String),
        onDismiss: expect.any(Function),
        timeout: expect.any(Number),
        type: 'error'
    });
});
