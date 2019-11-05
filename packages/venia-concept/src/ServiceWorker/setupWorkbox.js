export default function() {
    /**
     * Import and Instantiate workbox object.
     */
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js'
    );

    /**
     * Skip waiting for old service worker to stop.
     * This line will remove the old service worker
     * and install the new version immediately.
     *
     * If there are breaking changes with the new update
     * it is advised to remove this line and let the
     * browser handle delete and update of the service worker.
     */
    workbox.core.skipWaiting();

    /**
     * This will claim/control all clients once the service worker is
     * active. If this is not desired, remove this line and the
     * browser will let the service worker control the clients
     * after a page reresh.
     */
    workbox.core.clientsClaim();

    workbox.precaching.precacheAndRoute(self.__precacheManifest || []);
}
