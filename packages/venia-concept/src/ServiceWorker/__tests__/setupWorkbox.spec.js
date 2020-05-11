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
    self.__WB_MANIFEST = [];
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

test('precacheAndRoute should be called with self.__WB_MANIFEST is a truthy value', () => {
    const precacheAndRoute = jest.spyOn(
        global.workbox.precaching,
        'precacheAndRoute'
    );

    const testObj = [{ url: '/', revision: null }];

    self.__WB_MANIFEST = testObj;

    setupWorkbox();

    expect(precacheAndRoute).toHaveBeenCalledWith([
        ...testObj,
        { url: 'index.html', revision: null }
    ]);
});

test('precacheAndRoute should be called with [] if self.__WB_MANIFEST is a falsy value', () => {
    const precacheAndRoute = jest.spyOn(
        global.workbox.precaching,
        'precacheAndRoute'
    );

    self.__WB_MANIFEST = null;

    setupWorkbox();

    expect(precacheAndRoute).toHaveBeenCalledWith([]);
});
