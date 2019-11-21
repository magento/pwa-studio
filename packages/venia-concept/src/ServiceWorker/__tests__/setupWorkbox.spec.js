import setupWorkbox from '../setupWorkbox';

beforeEach(() => {
    global.workbox = {
        core: {
            skipWaiting: () => {},
            clientsClaim: () => {}
        },
        precaching: {
            precacheAndRoute: () => {}
        }
    };
    global.importScripts = () => {};
});

test('importScripts should be called to fetch workbox-sw.js file', () => {
    const importScripts = jest.spyOn(global, 'importScripts');

    setupWorkbox();

    expect(importScripts).toHaveBeenCalledWith(
        expect.stringContaining('workbox-sw.js')
    );
});

test('skipWaiting should be called on workbox.core object', () => {
    const skipWaiting = jest.spyOn(global.workbox.core, 'skipWaiting');

    setupWorkbox();

    expect(skipWaiting).toHaveBeenCalled();
});

test('clientsClaim should be called on workbox.core object', () => {
    const clientsClaim = jest.spyOn(global.workbox.core, 'clientsClaim');

    setupWorkbox();

    expect(clientsClaim).toHaveBeenCalled();
});

test('precacheAndRoute should be called with self.__precacheManifest is a truthy value', () => {
    const precacheAndRoute = jest.spyOn(
        global.workbox.precaching,
        'precacheAndRoute'
    );

    const testObj = {};

    self.__precacheManifest = testObj;

    setupWorkbox();

    expect(precacheAndRoute).toHaveBeenCalledWith(testObj);
});

test('precacheAndRoute should be called with [] if self.__precacheManifest is a falsey value', () => {
    const precacheAndRoute = jest.spyOn(
        global.workbox.precaching,
        'precacheAndRoute'
    );

    self.__precacheManifest = null;

    setupWorkbox();

    expect(precacheAndRoute).toHaveBeenCalledWith([]);
});
