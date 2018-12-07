const thirtyDays = 30 * 24 * 60 * 60;
workbox.skipWaiting();
workbox.clientsClaim();

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
    /\/media\/catalog.*\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'catalog',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: thirtyDays // 30 Days
            })
        ]
    })
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
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
