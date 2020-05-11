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

    /**
     * `self.__WB_MANIFEST` will be replaced with an array of assets
     * that webpack will be emitting during the compilation process
     * before writing the files in the file system.
     *
     * ```js
     *  Array<{url: String, revision: null|String}>
     * ```
     */
    const precacheAssets = self.__WB_MANIFEST;

    /**
     * We add the `index.html` URL to the precache list, because this
     * file will be created after the emit phase of webpack. Due to this, it
     * will not be available in `self.__WB_MANIFEST`. Hence adding it manually.
     */
    workbox.precaching.precacheAndRoute(
        precacheAssets
            ? [...precacheAssets, { url: 'index.html', revision: null }]
            : []
    );
}
