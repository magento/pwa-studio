export default function() {
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
    );

    workbox.core.skipWaiting();

    workbox.core.clientsClaim();

    workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
}
