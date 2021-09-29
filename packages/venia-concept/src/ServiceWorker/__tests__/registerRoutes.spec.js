import { registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import {
    CacheFirst,
    StaleWhileRevalidate,
    NetworkFirst
} from 'workbox-strategies';

import {
    findSameOrLargerImage,
    createImageCacheHandler
} from '../Utilities/imageCacheHandler';
import {
    THIRTY_DAYS,
    MAX_NUM_OF_IMAGES_TO_CACHE,
    IMAGES_CACHE_NAME
} from '../defaults';
import registerRoutes from '../registerRoutes';

jest.mock('workbox-expiration', () => {
    return {
        ExpirationPlugin: jest.fn()
    };
});

jest.mock('workbox-routing', () => {
    return {
        registerRoute: jest.fn()
    };
});

jest.mock('workbox-strategies', () => {
    return {
        CacheFirst: jest.fn(),
        StaleWhileRevalidate: jest.fn(),
        NetworkFirst: jest.fn()
    };
});

jest.mock('../Utilities/imageCacheHandler', () => {
    return {
        isResizedImage: jest.fn(),
        findSameOrLargerImage: jest.fn(),
        createImageCacheHandler: jest.fn()
    };
});

test("A total of 5 routes need to be registered using workbox's registerRoute API", () => {
    registerRoutes();

    expect(registerRoute).toHaveBeenCalledTimes(5);

    registerRoute.mockClear();
});

test('There should be a route for robots.txt, favicon.ico and manifest.json with StaleWhileRevalidate strategy', () => {
    registerRoutes();

    const [registrationCall] = registerRoute.mock.calls.filter(
        call =>
            call[0].toString() ===
            new RegExp('(robots.txt|favicon.ico|manifest.json)').toString()
    );

    expect(registrationCall[1]).toBeInstanceOf(StaleWhileRevalidate);

    registerRoute.mockClear();
});

test('There should be a route for resized images without cache handler', async () => {
    const mockUrl = 'mockUrl';
    const mockRequest = jest.fn();
    const mockEvent = {
        waitUntil: jest.fn()
    };
    const mockData = {
        url: mockUrl,
        request: mockRequest,
        event: mockEvent
    };

    const mockFindSameOrLargerImage = jest.fn((url, request) => {
        return Promise.resolve({ url, request });
    });

    findSameOrLargerImage.mockImplementation(mockFindSameOrLargerImage);

    registerRoutes();

    const [, handlerCall] = registerRoute.mock.calls[1];
    const registerResult = await handlerCall(mockData);

    expect(mockFindSameOrLargerImage).toHaveBeenCalled();
    expect(registerResult).toStrictEqual({
        url: mockUrl,
        request: mockRequest
    });

    registerRoute.mockClear();
});

test('There should be a route for resized images with cache handler', async () => {
    const mockUrl = 'mockUrl';
    const mockRequest = jest.fn();
    const mockEvent = {
        waitUntil: jest.fn()
    };
    const mockData = {
        url: mockUrl,
        request: mockRequest,
        event: mockEvent
    };

    const mockFindSameOrLargerImage = jest.fn(() => {
        return Promise.resolve(null);
    });

    findSameOrLargerImage.mockImplementation(mockFindSameOrLargerImage);

    const mockCacheHandler = jest.fn(data => data);

    createImageCacheHandler.mockImplementation(() => ({
        handle: mockCacheHandler
    }));

    registerRoutes();

    const [, handlerCall] = registerRoute.mock.calls[1];
    const registerResult = await handlerCall(mockData);

    expect(mockFindSameOrLargerImage).toHaveBeenCalled();
    expect(mockCacheHandler).toHaveBeenCalled();
    expect(registerResult).toStrictEqual({
        event: mockEvent,
        request: mockRequest
    });

    registerRoute.mockClear();
});

test('There should be a route for all image types with CacheFirst strategy', () => {
    registerRoutes();

    const [registrationCall] = registerRoute.mock.calls.filter(
        call =>
            call[0].toString() ===
            new RegExp(/\.(?:png|gif|jpg|jpeg|svg)$/).toString()
    );

    expect(registrationCall[1]).toBeInstanceOf(CacheFirst);

    const cacheFirstCallArgs = CacheFirst.mock.calls[0][0];
    const expirationPluginCallArgs = ExpirationPlugin.mock.calls[0][0];

    expect(cacheFirstCallArgs.cacheName).toEqual(IMAGES_CACHE_NAME);
    expect(cacheFirstCallArgs.plugins[0]).toBeInstanceOf(ExpirationPlugin);

    expect(expirationPluginCallArgs).toEqual({
        maxEntries: MAX_NUM_OF_IMAGES_TO_CACHE,
        maxAgeSeconds: THIRTY_DAYS,
        matchOptions: {
            ignoreVary: true
        }
    });
    expect(expirationPluginCallArgs.maxEntries).toBe(
        MAX_NUM_OF_IMAGES_TO_CACHE
    );
    expect(expirationPluginCallArgs.maxAgeSeconds).toBe(THIRTY_DAYS);

    registerRoute.mockClear();
});

test('There should be a route for all js files with CacheFirst strategy', () => {
    registerRoutes();

    const [registrationCall] = registerRoute.mock.calls.filter(
        call => call[0].toString() === new RegExp(/\.js$/).toString()
    );

    expect(registrationCall[1]).toBeInstanceOf(CacheFirst);

    registerRoute.mockClear();
});

test('There should be a route for all HTML routes with NetworkFirst strategy', () => {
    registerRoutes();

    const registrationCall = registerRoute.mock.calls[4];

    expect(registrationCall[1]).toBeInstanceOf(NetworkFirst);

    registerRoute.mockClear();
});

test('does not register route with different origin', () => {
    const mockURL = {
        url: {
            origin: 'https://third.party.origin',
            pathname: '/'
        },
        request: {
            destination: 'document'
        }
    };

    registerRoutes();

    const registrationCall = registerRoute.mock.calls[4];
    const [captureFunction] = registrationCall;

    const registerResult = captureFunction(mockURL);

    expect(registerResult).toBe(false);
});

test('does not register route with same origin', () => {
    const mockURL = {
        url: {
            origin: self.location.origin,
            pathname: '/'
        },
        request: {
            destination: 'document'
        }
    };

    registerRoutes();

    const registrationCall = registerRoute.mock.calls[4];
    const [captureFunction] = registrationCall;

    const registerResult = captureFunction(mockURL);

    expect(registerResult).toBe(true);
});
