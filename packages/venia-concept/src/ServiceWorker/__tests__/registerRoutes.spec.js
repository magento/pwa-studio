import { THIRTY_DAYS, MAX_NUM_OF_IMAGES_TO_CACHE } from '../defaults';
import registerRoutes from '../registerRoutes';

function StaleWhileRevalidate(options = {}) {
    this.cacheName = options.cacheName;
    this.plugins = options.plugins;
}

function CacheFirst(options = {}) {
    this.cacheName = options.cacheName;
    this.plugins = options.plugins;
}

function cacheableResponsePlugin() {}

function expirationPlugin(options = {}) {
    this.maxEntries = options.maxEntries;
    this.maxAgeSeconds = options.maxAgeSeconds;
}

beforeAll(() => {
    global.workbox = {
        strategies: {
            StaleWhileRevalidate,
            CacheFirst
        },
        cacheableResponse: {
            Plugin: cacheableResponsePlugin
        },
        expiration: {
            Plugin: expirationPlugin
        },
        routing: {
            registerRoute: function() {}
        }
    };
});

test("A total of 5 routes need to be registered using workbox's registerRoute API", () => {
    const registerRoute = jest.spyOn(global.workbox.routing, 'registerRoute');

    registerRoutes();

    expect(registerRoute).toHaveBeenCalledTimes(5);

    registerRoute.mockClear();
});

test('There should be a route for robots.txt, favicon.ico and manifest.json with StaleWhileRevalidate strategy', () => {
    const registerRoute = jest.spyOn(global.workbox.routing, 'registerRoute');

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
    const registerRoute = jest.spyOn(global.workbox.routing, 'registerRoute');

    registerRoutes();

    const [registrationCall] = registerRoute.mock.calls.filter(
        call =>
            call[0].toString() ===
            new RegExp(/\.(?:png|gif|jpg|jpeg|svg)$/).toString()
    );

    expect(registrationCall[1]).toBeInstanceOf(CacheFirst);
    expect(registrationCall[1].cacheName).toBe('images');
    expect(registrationCall[1].plugins[0]).toBeInstanceOf(expirationPlugin);
    expect(registrationCall[1].plugins[0].maxEntries).toBe(
        MAX_NUM_OF_IMAGES_TO_CACHE
    );
    expect(registrationCall[1].plugins[0].maxAgeSeconds).toBe(THIRTY_DAYS);

    registerRoute.mockClear();
});

test('There should be a route for all js files with CacheFirst strategy', () => {
    const registerRoute = jest.spyOn(global.workbox.routing, 'registerRoute');

    registerRoutes();

    const [registrationCall] = registerRoute.mock.calls.filter(
        call => call[0].toString() === new RegExp(/\.js$/).toString()
    );

    expect(registrationCall[1]).toBeInstanceOf(CacheFirst);

    console.log(registerRoute.mock.calls);

    console.log('\n\n\n\n');

    console.log(registerRoute.mock.calls.reverse()[0]);

    registerRoute.mockClear();
});
