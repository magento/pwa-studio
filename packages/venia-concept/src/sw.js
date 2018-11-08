workbox.skipWaiting();
workbox.clientsClaim();

function precacheManifest() {
    fetch('/roots-manifest.json')
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            let toCache = [];
            Object.keys(json).forEach(key => {
                toCache.push(json[key].chunkName);
            });
            toCache = toCache.concat([
                'roots-manifest.json',
                'favicon.ico',
                '/'
            ]);
            workbox.precaching.precache(toCache);
        });
}

precacheManifest();

workbox.routing.registerRoute('/', workbox.strategies.staleWhileRevalidate());

workbox.routing.registerRoute(
    new RegExp('\\.html$'),
    workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
    new RegExp('/.\\.js$'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    new RegExp('roots-manifest.json'),
    workbox.strategies.staleWhileRevalidate()
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
            })
        ]
    })
);

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.

// TODO: Add fallbacks
workbox.routing.setCatchHandler(({ event }) => {
    // Use event, request, and url to figure out how to respond.
    // One approach would be to use request.destination, see
    // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
    switch (event.request.destination) {
        case 'image':
            return caches.match(FALLBACK_IMAGE_URL);
            break;

        case 'font':
            return caches.match(FALLBACK_FONT_URL);
            break;

        default:
            // If we don't have a fallback, just return an error response.
            return Response.error();
    }
});
