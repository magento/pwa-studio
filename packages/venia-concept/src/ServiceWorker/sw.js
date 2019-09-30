import registerRoutes from './registerRoutes';

workbox.core.skipWaiting();

workbox.core.clientsClaim();

workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

registerRoutes();

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.

// TODO: Add fallbacks
