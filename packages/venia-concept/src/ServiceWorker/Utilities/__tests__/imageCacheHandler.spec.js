jest.mock('../networkUtils');

import { PREFETCH_IMAGES } from '@magento/venia-ui/lib/constants/swMessageTypes';
import { THIRTY_DAYS, CATALOG_CACHE_NAME } from '../../defaults';
import {
    isResizedCatalogImage,
    findSameOrLargerImage,
    createCatalogCacheHandler,
    registerImagePreFetchHandler
} from '../imageCacheHandler';
import { __handlers__ } from '../messageHandler';
import { isFastNetwork } from '../networkUtils';

describe('Testing isResizedCatalogImage', () => {
    const validCatalogImageURL =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640&height=800';

    const catalogImageURLWithInvalidWidth =
        'https://develop.pwa-venia.com/media/catalog/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640px&height=800px';

    const invalidCatalogImageURL =
        'https://develop.pwa-venia.com/product/cache/6ff2031bbe5bd4726a5a91896c8bef9e/v/d/vd07-pe_main_2.jpg?auto=webp&format=pjpg&width=640&height=800';

    test('isResizedCatalogImage should return boolean', () => {
        expect(
            typeof isResizedCatalogImage({ url: new URL(validCatalogImageURL) })
        ).toBe('boolean');
    });

    test('isResizedCatalogImage should return true if the url provided is a valid catalog image url', () => {
        expect(
            isResizedCatalogImage({ url: new URL(validCatalogImageURL) })
        ).toBeTruthy();
    });

    test('isResizedCatalogImage should return false if /media/catalog is missing in the URL', () => {
        expect(
            isResizedCatalogImage({
                url: new URL(invalidCatalogImageURL)
            })
        ).toBeFalsy();
    });

    test('isResizedCatalogImage should return false if width search param is not valid in the URL', () => {
        expect(
            isResizedCatalogImage({
                url: new URL(catalogImageURLWithInvalidWidth)
            })
        ).toBeFalsy();
    });

    test('isResizedCatalogImage should throw error if url is missing in the function params', () => {
        expect(() => isResizedCatalogImage()).toThrowError();
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

describe('Testing createCatalogCacheHandler', () => {
    function CacheFirst(options = {}) {
        this.cacheName = options.cacheName;
        this.plugins = options.plugins;
    }

    function CacheableResponsePlugin(options = {}) {
        this.statuses = options.statuses;
    }

    function ExpirationPlugin(options = {}) {
        this.maxEntries = options.maxEntries;
        this.maxAgeSeconds = options.maxAgeSeconds;
    }

    beforeAll(() => {
        global.workbox = {
            strategies: {
                CacheFirst
            },
            cacheableResponse: {
                Plugin: CacheableResponsePlugin
            },
            expiration: {
                Plugin: ExpirationPlugin
            }
        };
    });

    test('createCatalogCacheHandler should return an instance of workbox.strategies.CacheFirst', () => {
        expect(createCatalogCacheHandler()).toBeInstanceOf(CacheFirst);
    });

    test('createCatalogCacheHandler should generate handler with cacheName set to the value of CATALOG_CACHE_NAME', () => {
        expect(createCatalogCacheHandler().cacheName).toBe(CATALOG_CACHE_NAME);
    });

    test('createCatalogCacheHandler should generate handler with the exipiration plugin', () => {
        const handler = createCatalogCacheHandler();
        const [expirationPlugin] = handler.plugins.filter(
            plugin => plugin instanceof ExpirationPlugin
        );

        expect(expirationPlugin.maxEntries).toBe(60);
        expect(expirationPlugin.maxAgeSeconds).toBe(THIRTY_DAYS);
    });

    test('createCatalogCacheHandler should use the cacheable response plugin for statuses 0 and 200', () => {
        const handler = createCatalogCacheHandler();
        const [cacheableResponsePlugin] = handler.plugins.filter(
            plugin => plugin instanceof CacheableResponsePlugin
        );

        expect(cacheableResponsePlugin.statuses).toEqual([0, 200]);
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
