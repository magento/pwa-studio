const thirtyDays = 30 * 24 * 60 * 60;
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
    '/',
    new workbox.strategies.StaleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('\\.html$'),
    new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
    new RegExp('/.\\.js$'),
    new workbox.strategies.StaleWhileRevalidate()
);

const catalogCacheName = 'catalog';

const getWidth = url => Number(new URLSearchParams(url.search).get('width'));

const isCatalogImage = ({ url }) => url.pathname.startsWith('/media/catalog');

const isResizedCatalogImage = ({ url }) =>
    isCatalogImage({ url }) && !isNaN(getWidth(url));

const catalogCacheHandler = new workbox.strategies.StaleWhileRevalidate({
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

const findSameOrLargerImage = async (url, request) => {
    const requestedWidth = getWidth(url);

    const cache = await caches.open(catalogCacheName);
    const cachedSources = await cache.matchAll(request, {
        ignoreSearch: true
    });

    // Find the cached version of this image that is closest to the requested
    // width without going under it.
    let best = { difference: Infinity, candidate: null };
    for (const candidate of cachedSources) {
        const width = getWidth(new URL(candidate.url));
        if (isNaN(width)) {
            // cached image has no resize param, so we can't safely use it
            continue;
        }

        const difference = width - requestedWidth;

        if (difference < 0) {
            // cached image is smaller than requested, so we can't safely use it
            continue;
        }

        if (difference === 0) {
            // cached image is exactly what we want, so shortcut to this one
            return candidate;
        }

        // we now know the cached image is larger than requested, but we don't
        // want to serve an unnecessarily large image if a smaller one is
        // available, to save device processing power and memory
        if (difference < best.difference) {
            // cached image is larger than requested, but smaller than the
            // previous existing match
            best = {
                difference,
                candidate
            };
        }
    }
    if (best.candidate) {
        console.log(
            `ServiceWorker responding to GET ${
                url.pathname
            } at ${requestedWidth}w with cached version ${
                best.difference
            }px larger: ${best.candidate.url}`
        );
        return best.candidate;
    }
};

workbox.routing.registerRoute(
    isResizedCatalogImage,
    ({ url, request, event }) => {
        const sameOrLargerImagePromise = findSameOrLargerImage(url, request);
        event.waitUntil(sameOrLargerImagePromise);
        return sameOrLargerImagePromise.then(
            response =>
                response || catalogCacheHandler.handle({ request, event })
        );
    }
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    new workbox.strategies.CacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: thirtyDays // 30 Days
            })
        ]
    })
);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.

// TODO: Add fallbacks
