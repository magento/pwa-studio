import { skipWaiting, clientsClaim } from 'workbox-core';
import { precacheAndRoute } from 'workbox-precaching';

export default function() {
    /**
     * Import and Instantiate workbox object.
     */
    importScripts(
        'https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js'
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
    skipWaiting();

    /**
     * This will claim/control all clients once the service worker is
     * active. If this is not desired, remove this line and the
     * browser will let the service worker control the clients
     * after a page reresh.
     */
    clientsClaim();

    /**
     * This will be replaced with an array of assets
     * that webpack will be emitting during the compilation process
     * before writing the files in the file system.
     *
     * ```js
     *  Array<{url: String, revision: null|String}>
     * ```
     */
    const precacheAssets = self.__WB_MANIFEST;

    precacheAndRoute(precacheAssets || []);
}
