import { THIRTY_DAYS, CATALOG_CACHE_NAME } from '../../defaults';
import { createCatalogCacheHandler } from '../catalogCacheHandler';

function StaleWhileRevalidate(options = {}) {
    this.cacheName = options.cacheName;
    this.plugins = options.plugins;
}

function CacheableResponsePlugin() {}

function ExpirationPlugin(options = {}) {
    this.maxEntries = options.maxEntries;
    this.maxAgeSeconds = options.maxAgeSeconds;
}

beforeAll(() => {
    global.workbox = {
        strategies: {
            StaleWhileRevalidate
        },
        cacheableResponse: {
            Plugin: CacheableResponsePlugin
        },
        expiration: {
            Plugin: ExpirationPlugin
        }
    };
});

test('createCatalogCacheHandler should return an instance of workbox.strategies.StaleWhileRevalidate', () => {
    expect(createCatalogCacheHandler()).toBeInstanceOf(StaleWhileRevalidate);
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
