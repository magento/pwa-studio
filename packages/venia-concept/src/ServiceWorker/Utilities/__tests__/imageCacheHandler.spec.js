jest.mock('../networkUtils');
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { MESSAGE_TYPES } from '@magento/peregrine/lib/util/swUtils';
import { THIRTY_DAYS, IMAGES_CACHE_NAME } from '../../defaults';
import {
    isResizedImage,
    findSameOrLargerImage,
    createImageCacheHandler,
    registerImagePreFetchHandler
} from '../imageCacheHandler';
import { __handlers__ } from '../messageHandler';
import { isFastNetwork } from '../networkUtils';

jest.mock('workbox-cacheable-response', () => {
    return {
        CacheableResponsePlugin: jest.fn()
    };
});

jest.mock('workbox-expiration', () => {
    return {
        ExpirationPlugin: jest.fn()
    };
});

jest.mock('workbox-strategies', () => {
    return {
        CacheFirst: jest.fn()
    };
});

const { PREFETCH_IMAGES } = MESSAGE_TYPES;

describe('Testing isResizedImage', () => {
    const validImage =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640&height=800';

    const invalidImage =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.svg?auto=webp&format=pjpg&width=640&height=800';

    const imageURLWithInvalidWidth =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640px&height=800px';

    const validJpegImage =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpeg?auto=webp&format=pjpg&width=640&height=800';

    const validJpgImage =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640&height=800';

    const validPngImage =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.png?auto=webp&format=pjpg&width=640&height=800';

    test('isResizedImage should return boolean', () => {
        expect(typeof isResizedImage({ url: new URL(validImage) })).toBe(
            'boolean'
        );
    });

    test('isResizedImage should return true if the url provided is a valid catalog image url', () => {
        expect(isResizedImage({ url: new URL(validImage) })).toBeTruthy();
    });

    test('isResizedImage should return true if the resource is a jpeg image', () => {
        expect(
            isResizedImage({
                url: new URL(validJpegImage)
            })
        ).toBeTruthy();
    });

    test('isResizedImage should return true if the resource is a jpg image', () => {
        expect(
            isResizedImage({
                url: new URL(validJpgImage)
            })
        ).toBeTruthy();
    });

    test('isResizedImage should return true if the resource is a png image', () => {
        expect(
            isResizedImage({
                url: new URL(validPngImage)
            })
        ).toBeTruthy();
    });

    test('isResizedImage should return false if the resource is of an invalid type', () => {
        expect(
            isResizedImage({
                url: new URL(invalidImage)
            })
        ).toBeFalsy();
    });

    test('isResizedImage should return false if width search param is not valid in the URL', () => {
        expect(
            isResizedImage({
                url: new URL(imageURLWithInvalidWidth)
            })
        ).toBeFalsy();
    });

    test('isResizedImage should throw error if url is missing in the function params', () => {
        expect(() => isResizedImage()).toThrowError();
    });
});

describe('Testing findSameOrLargerImage', () => {
    const mockMatchFn = jest.fn();

    beforeAll(() => {
        global.caches = {
            open: function() {
                return Promise.resolve({
                    keys: function() {
                        return Promise.resolve([
                            {
                                url:
                                    'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=160&height=200'
                            },
                            {
                                url:
                                    'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=320&height=400'
                            },
                            {
                                url:
                                    'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=1600&height=2000'
                            }
                        ]);
                    },
                    match: mockMatchFn
                });
            }
        };
    });

    test('Should return response from cache for same URL if available', async () => {
        const expectedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=1600&height=2000';

        mockMatchFn.mockReturnValue(Promise.resolve({ url: expectedUrl }));

        const returnedResponse = await findSameOrLargerImage(
            new URL(expectedUrl)
        );

        expect(returnedResponse.url).toBe(expectedUrl);
    });

    test('Should not return response if URL for same filename is not available', async () => {
        const fileName1 = 'prefixed-file-name.jpg';
        const fileName2 = 'file-name.jpg';

        mockMatchFn.mockReturnValue(
            Promise.resolve({
                url: `https://develop.pwa-venia.com/media/catalog/v/s/${fileName1}?auto=webp&format=pjpg&width=1600&height=2000`
            })
        );

        const returnedResponse = await findSameOrLargerImage(
            new URL(
                `https://develop.pwa-venia.com/media/catalog/v/s/${fileName2}?auto=webp&format=pjpg&width=1600&height=2000`
            )
        );

        expect(returnedResponse).toBeUndefined();
    });

    test('Should return the closest high resolution image response from cache for a given width', async () => {
        const requestedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=800&height=1000';

        const expectedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=1600&height=2000';

        mockMatchFn.mockReturnValue(Promise.resolve({ url: expectedUrl }));

        const returnedResponse = await findSameOrLargerImage(
            new URL(requestedUrl)
        );

        expect(returnedResponse.url).toBe(expectedUrl);
    });

    test('Should return undefined if no closest high resolution image response is available in cache', async () => {
        const requestedUrl =
            'https://develop.pwa-venia.com/media/catalog/v/s/vsk12-la_main_3.jpg?auto=webp&format=pjpg&width=2400&height=3000';

        const returnedResponse = await findSameOrLargerImage(
            new URL(requestedUrl)
        );

        expect(returnedResponse).toBe(undefined);
    });
});

describe('Testing createImageCacheHandler', () => {
    test('createImageCacheHandler should return an instance of workbox.strategies.CacheFirst', () => {
        expect(createImageCacheHandler()).toBeInstanceOf(CacheFirst);
    });

    test('createImageCacheHandler should generate handler with cacheName set to the value of IMAGES_CACHE_NAME', () => {
        createImageCacheHandler();
        expect(CacheFirst.mock.calls[0][0].cacheName).toBe(IMAGES_CACHE_NAME);
    });

    test('createImageCacheHandler should generate handler with the exipiration plugin', () => {
        createImageCacheHandler();
        const expirationPluginCallArgs = ExpirationPlugin.mock.calls[0][0];
        expect(expirationPluginCallArgs.maxEntries).toBe(60);
        expect(expirationPluginCallArgs.maxAgeSeconds).toBe(THIRTY_DAYS);
    });

    test('createImageCacheHandler should use the cacheable response plugin for statuses 0 and 200', () => {
        createImageCacheHandler();
        expect(CacheableResponsePlugin.mock.calls[0][0].statuses).toEqual([
            0,
            200
        ]);
    });
});

describe('Testing registerImagePreFetchHandler', () => {
    function clearHandlersObject() {
        Object.keys(__handlers__).forEach(messageType => {
            delete __handlers__[messageType];
        });
    }

    const mockMatchFn = jest.fn();

    const mockPutFn = jest.fn();

    const mockFetch = jest.fn();

    beforeAll(() => {
        global.fetch = mockFetch;
        global.caches = {
            open: function() {
                return Promise.resolve({
                    put: mockPutFn
                });
            },
            match: mockMatchFn
        };
    });

    beforeEach(() => {
        clearHandlersObject();
        mockMatchFn.mockRestore();
        mockPutFn.mockRestore();
        mockFetch.mockRestore();
    });

    test('registerImagePreFetchHandler should create a handler for PREFETCH_IMAGES', () => {
        expect(__handlers__).not.toHaveProperty(PREFETCH_IMAGES);

        registerImagePreFetchHandler();

        expect(__handlers__).toHaveProperty(PREFETCH_IMAGES);
    });

    test("PREFETCH_IMAGES's handler should not pre fetch if network is slow and send error status as reply", () => {
        const mockPostmessage = jest.fn();
        const event = { ports: [{ postMessage: mockPostmessage }] };
        const payload = {
            urls: []
        };

        isFastNetwork.mockReturnValue(false);

        registerImagePreFetchHandler();

        const returnValue = __handlers__[PREFETCH_IMAGES][0](payload, event);

        expect(mockPostmessage).toHaveBeenCalledWith({
            status: 'error',
            message: `Slow Network detected. Not pre-fetching images. ${
                payload.urls
            }`
        });

        expect(returnValue).toBeNull();
    });

    test("If fast network, PREFETCH_IMAGES's handler should fetch images if not cached already and cache it for future use", async () => {
        const sampleUrl = 'www.adobe.com';
        const mockPostmessage = jest.fn();
        const event = { ports: [{ postMessage: mockPostmessage }] };
        const payload = {
            urls: [sampleUrl]
        };
        const mockClone = jest.fn();
        const mockRespose = {
            clone: mockClone
        };
        const mockCloneReturnValue = {};

        isFastNetwork.mockReturnValue(true);
        mockMatchFn.mockReturnValue(Promise.resolve(null));
        mockFetch.mockReturnValue(Promise.resolve(mockRespose));
        mockClone.mockReturnValue(mockCloneReturnValue);
        mockPutFn.mockReturnValue(Promise.resolve(true));

        registerImagePreFetchHandler();

        const handler = __handlers__[PREFETCH_IMAGES][0];

        const returnValue = await handler(payload, event);

        expect(mockPostmessage).toHaveBeenCalledWith({ status: 'done' });
        expect(mockFetch).toHaveBeenCalledWith(sampleUrl, { mode: 'no-cors' });
        expect(mockPutFn).toHaveBeenCalledWith(sampleUrl, mockCloneReturnValue);
        expect(returnValue[0]).toBe(mockRespose);
    });

    test("If fast network, PERFETCH_IMAGES's handler should not fetch images if already cached", async () => {
        const sampleUrl = 'www.adobe.com';
        const mockPostmessage = jest.fn();
        const event = { ports: [{ postMessage: mockPostmessage }] };
        const payload = {
            urls: [sampleUrl]
        };
        const mockRespose = {};

        isFastNetwork.mockReturnValue(true);
        mockMatchFn.mockReturnValue(Promise.resolve(mockRespose));
        mockFetch.mockReturnValue(Promise.resolve(mockRespose));
        mockPutFn.mockReturnValue(Promise.resolve(true));

        registerImagePreFetchHandler();

        const handler = __handlers__[PREFETCH_IMAGES][0];

        const returnValue = await handler(payload, event);

        expect(mockPostmessage).toHaveBeenCalledWith({ status: 'done' });
        expect(mockFetch).not.toHaveBeenCalled();
        expect(mockPutFn).not.toHaveBeenCalled();
        expect(returnValue[0]).toBe(mockRespose);
    });
});
