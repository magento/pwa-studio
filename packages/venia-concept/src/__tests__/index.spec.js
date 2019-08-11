import { withRouter } from 'react-router-dom';
import { setContext } from 'apollo-link-context';
import { Util } from '@magento/peregrine';
import store from '../store';

jest.mock('react-dom');
jest.mock('react-router-dom');
jest.mock('apollo-link-context', () => {
    const concat = jest.fn(x => x);
    const mockContextLink = {
        setContext: jest.fn(() => ({
            concat
        })),
        concat
    };
    return mockContextLink;
});
jest.mock('apollo-link-http', () => {
    const concat = jest.fn(x => x);
    const request = jest.fn();
    const mockLink = jest.fn(() => ({
        concat,
        request
    }));
    mockLink.createHttpLink = mockLink;
    mockLink.concat = concat;
    mockLink.request = request;
    return mockLink;
});
jest.mock('../store', () => ({
    dispatch: jest.fn(),
    getState: jest.fn(),
    replaceReducer: jest.fn(),
    subscribe: jest.fn()
}));

const mockSw = {
    register: jest.fn(async () => 'REGISTRATION')
};

const getItem = jest.fn();
jest.spyOn(Util, 'BrowserPersistence').mockImplementation(
    function BrowserPersistence() {
        return { getItem };
    }
);

jest.spyOn(document, 'getElementById').mockImplementation(() => 'ELEMENT');
jest.spyOn(window, 'addEventListener').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});

withRouter.mockImplementation(x => x);

const getEventSubscriptions = (element, event) =>
    element.addEventListener.mock.calls
        .filter(([type]) => type === event)
        .map(([, handler]) => handler);

const swSupported =
    navigator.serviceWorker &&
    typeof navigator.serviceWorker.register === 'function';

if (swSupported) {
    jest.spyOn(navigator.serviceWorker.register, mockSw.register);
} else {
    Object.defineProperty(navigator, 'serviceWorker', {
        value: mockSw
    });
}

test('renders the root and subscribes to global events', async () => {
    jest.isolateModules(() => {
        require('../');
        expect(setContext).toHaveBeenCalled();
        const contextCallback = setContext.mock.calls[0][0];
        expect(
            contextCallback(null, { headers: { foo: 'bar' } })
        ).toMatchObject({
            headers: {
                foo: 'bar',
                authorization: ''
            }
        });
        getItem.mockReturnValueOnce('blarg');
        expect(contextCallback(null, { headers: {} })).toMatchObject({
            headers: {
                authorization: 'Bearer blarg'
            }
        });
        const onlineListeners = getEventSubscriptions(window, 'online');
        expect(onlineListeners).toHaveLength(1);
        onlineListeners[0]();
        expect(store.dispatch).toHaveBeenLastCalledWith(
            expect.objectContaining({
                type: 'APP/SET_ONLINE'
            })
        );
        const offlineListeners = getEventSubscriptions(window, 'offline');
        expect(offlineListeners).toHaveLength(1);
        offlineListeners[0]();
        expect(store.dispatch).toHaveBeenLastCalledWith(
            expect.objectContaining({
                type: 'APP/SET_OFFLINE'
            })
        );
    });
});

test('registers service worker in prod', () => {
    const testSwRegistration = async () => {
        window.addEventListener.mockClear();
        require('../');
        const loadListeners = getEventSubscriptions(window, 'load');
        expect(loadListeners).toHaveLength(1);
        await loadListeners[0]();
        expect(navigator.serviceWorker.register).toHaveBeenCalledWith('sw.js');
    };
    jest.isolateModules(async () => {
        const oldNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';
        await testSwRegistration();
        process.env.NODE_ENV = oldNodeEnv;
    });
    jest.isolateModules(async () => {
        process.env.DEV_SERVER_SERVICE_WORKER_ENABLED = '1';
        await testSwRegistration();
    });
    jest.isolateModules(async () => {
        process.env.DEV_SERVER_SERVICE_WORKER_ENABLED = '1';
        navigator.serviceWorker.register.mockRejectedValueOnce(
            new Error('waaaaagh')
        );
        await testSwRegistration();
    });
});
