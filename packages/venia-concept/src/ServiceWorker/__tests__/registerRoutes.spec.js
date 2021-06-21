import { cacheNames } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

import {
    THIRTY_DAYS,
    MAX_NUM_OF_IMAGES_TO_CACHE,
    IMAGES_CACHE_NAME
} from '../defaults';
import registerRoutes from '../registerRoutes';

jest.mock('workbox-core', () => {
    return {
        cacheNames: { precache: 'precache_assets_cache_name' }
    };
});

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
        StaleWhileRevalidate: jest.fn()
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
        maxAgeSeconds: THIRTY_DAYS
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

test('There should be a route for all HTML routes with StaleWhileRevalidate strategy', () => {
    registerRoutes();

    /**
     * This is a crude way to find the route by searching for
     * isHTMLRoute function in the .toString() output, but I am
     * out of options at this point.
     *
     * Obviously there might be a better way to do it just that I
     * am not aware of it at this point. Feel free to change it.
     */
    const [registrationCall] = registerRoute.mock.calls.filter(call =>
        call[0].toString().includes('isHTMLRoute')
    );

    expect(registrationCall[1]).toBeInstanceOf(StaleWhileRevalidate);

    const staleWhileRevalidateCallArgs = StaleWhileRevalidate.mock.calls[1][0];

    expect(
        staleWhileRevalidateCallArgs.plugins[0].cacheKeyWillBeUsed
    ).toBeInstanceOf(Function);
    expect(staleWhileRevalidateCallArgs.cacheName).toEqual(cacheNames.precache);

    registerRoute.mockClear();
});

test('does not register route with different origin', () => {
    registerRoutes();

    const mockURL = {
        url: {
            origin: 'https://third.party.origin',
            pathname: '/'
        }
    };

    const [registrationCall] = registerRoute.mock.calls.filter(call =>
        call[0].toString().includes('isHTMLRoute')
    );
    const [captureFunction] = registrationCall;

    const registerResult = captureFunction(mockURL);

    expect(registerResult).toBe(false);
});
