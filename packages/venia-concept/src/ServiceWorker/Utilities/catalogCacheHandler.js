import { THIRTY_DAYS, CATALOG_CACHE_NAME } from '../defaults';

export const createCatalogCacheHandler = function() {
    return new workbox.strategies.StaleWhileRevalidate({
        cacheName: CATALOG_CACHE_NAME,
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: THIRTY_DAYS
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    });
};
