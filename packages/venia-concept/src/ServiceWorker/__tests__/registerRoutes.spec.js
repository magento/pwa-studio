import { cacheNames } from 'workbox-core';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';

import { THIRTY_DAYS, MAX_NUM_OF_IMAGES_TO_CACHE } from '../defaults';
import registerRoutes from '../registerRoutes';

jest.mock('workbox-core', () => {
    return {
        cacheNames: { precache: 'precache_assets_cache_name' }
    };
});

jest.mock('workbox-expiration', () => {
    return {
        ExpirationPlugin: jest.fn().mockImplementation()
    };
});
jest.mock('workbox-routing', () => {
    return {
        registerRoute: jest.fn()
    };
});

jest.mock('workbox-strategies', () => {
    return {
        CacheFirst: jest.fn().mockImplementation(options => {
            return options;
        }),
        StaleWhileRevalidate: jest.fn().mockImplementation(() => {})
    };
});

jest.mock('../Utilities/imageCacheHandler', () => {
    return {
        isResizedCatalogImage: jest.fn(),
        findSameOrLargerImage: jest.fn(),
        createCatalogCacheHandler: jest.fn()
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

    console.log(registrationCall[1].calls[0]);
    expect(registrationCall[1].mock.calls[0]).toEqual('images');
    expect(registrationCall[1].plugins[0]).toEqual({
        maxEntries: MAX_NUM_OF_IMAGES_TO_CACHE,
        maxAgeSeconds: THIRTY_DAYS
    });
    // expect(registrationCall[1].plugins[0]).toBeInstanceOf(expirationPlugin);
    // expect(registrationCall[1].plugins[0].maxEntries).toBe(
    //     MAX_NUM_OF_IMAGES_TO_CACHE
    // );
    // expect(registrationCall[1].plugins[0].maxAgeSeconds).toBe(THIRTY_DAYS);

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
    expect(registrationCall[1].cacheName).toEqual(cacheNames.precache);

    registerRoute.mockClear();
});
