import { thirtyDays, catalogCacheName } from '../defaults';

export const catalogCacheHandler = new workbox.strategies.StaleWhileRevalidate({
    cacheName: catalogCacheName,
    plugins: [
        new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: thirtyDays
        }),
        new workbox.cacheableResponse.Plugin({
            statuses: [0, 200]
        })
    ]
});
