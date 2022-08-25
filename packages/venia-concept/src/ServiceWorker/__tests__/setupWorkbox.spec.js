import setupWorkbox from '../setupWorkbox';
import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

jest.mock('global');
jest.mock('workbox-core', () => {
    return {
        skipWaiting: jest.fn(),
        clientsClaim: jest.fn()
    };
});

jest.mock('workbox-precaching', () => {
    return {
        precacheAndRoute: jest.fn()
    };
});

beforeEach(() => {
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
    setupWorkbox();

    expect(skipWaiting).toHaveBeenCalled();
});

test('clientsClaim should be called on workbox.core object', () => {
    setupWorkbox();

    expect(clientsClaim).toHaveBeenCalled();
});

test('precacheAndRoute should be called with self.__WB_MANIFEST is a truthy value', () => {
    const testObj = [{ url: '/qwerty.12345.js', revision: '12345' }];

    self.__WB_MANIFEST = testObj;

    setupWorkbox();

    expect(precacheAndRoute).toHaveBeenCalledWith(testObj);
});

test('precacheAndRoute should be called with [] if self.__WB_MANIFEST is a falsy value', () => {
    self.__WB_MANIFEST = null;

    setupWorkbox();

    expect(precacheAndRoute).toHaveBeenCalledWith([]);
});
