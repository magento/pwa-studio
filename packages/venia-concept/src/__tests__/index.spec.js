import { setContext } from '@apollo/client/link/context';
import { Util } from '@magento/peregrine';
import store from '../store';

jest.mock('react-dom');
jest.mock('react-router-dom', () => ({
    useHistory: jest.fn()
}));
jest.mock('@apollo/client/link/retry');
jest.mock('@apollo/client/link/context', () => {
    const concat = jest.fn(x => x);
    const mockContextLink = {
        setContext: jest.fn(() => ({
            concat
        }))
    };
    return mockContextLink;
});
jest.mock('@apollo/client', () => {
    const actualClient = jest.requireActual('@apollo/client');
    const concat = jest.fn(x => x);
    const request = jest.fn();
    const mockLink = jest.fn(() => ({
        concat,
        request
    }));
    mockLink.createHttpLink = mockLink;
    mockLink.concat = concat;
    mockLink.request = request;
    return {
        ...actualClient,
        createHttpLink: mockLink,
        gql: jest.fn()
    };
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
        // Execute index.js.
        require('../');

        // Assert.
        expect(setContext).toHaveBeenCalled();
        const storeContextCallback = setContext.mock.calls[0][0];
        const authContextCallback = setContext.mock.calls[1][0];
        expect(
            storeContextCallback(null, { headers: { foo: 'bar' } })
        ).toMatchObject({
            headers: {
                foo: 'bar',
                store: 'default'
            }
        });
        expect(
            authContextCallback(null, { headers: { foo: 'bar' } })
        ).toMatchObject({
            headers: {
                foo: 'bar',
                authorization: ''
            }
        });

        // It includes the authorization header if the signin_token is present.
        getItem.mockReturnValue('blarg');
        expect(storeContextCallback(null, { headers: {} })).toMatchObject({
            headers: {
                store: 'default'
            }
        });
        expect(
            authContextCallback(null, { headers: { foo: 'bar' } })
        ).toMatchObject({
            headers: {
                foo: 'bar',
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
