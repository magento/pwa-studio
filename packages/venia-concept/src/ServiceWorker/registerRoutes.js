import { cacheNames } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import {
    isResizedImage,
    findSameOrLargerImage,
    createImageCacheHandler
} from './Utilities/imageCacheHandler';
import { isHTMLRoute } from './Utilities/routeHandler';
import {
    THIRTY_DAYS,
    MAX_NUM_OF_IMAGES_TO_CACHE,
    IMAGES_CACHE_NAME
} from './defaults';

/**
 * registerRoutes function contains all the routes that need to
 * be registered with workbox for caching and proxying.
 *
 * @returns {void}
 */
export default function() {
    const imageCacheHandler = createImageCacheHandler();

    registerRoute(
        new RegExp('(robots.txt|favicon.ico|manifest.json)'),
        new StaleWhileRevalidate()
    );

    /**
     * Route that checks for resized images in cache.
     */
    registerRoute(isResizedImage, ({ url, request, event }) => {
        const sameOrLargerImagePromise = findSameOrLargerImage(url, request);
        event.waitUntil(sameOrLargerImagePromise);
        return sameOrLargerImagePromise.then(
            response => response || imageCacheHandler.handle({ request, event })
        );
    });

    /**
     * Route to handle all types of images. Stores them in cache with a
     * cache name "images". They auto expire after 30 days and only 60
     * can be stored at a time.
     *
     * There is another route that handles images without width and options on them.
     * This route handles images that wont have width options on them.
     */
    registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        new CacheFirst({
            cacheName: IMAGES_CACHE_NAME,
            plugins: [
                new ExpirationPlugin({
                    maxEntries: MAX_NUM_OF_IMAGES_TO_CACHE, // 60 Images
                    maxAgeSeconds: THIRTY_DAYS // 30 Days
                })
            ]
        })
    );

    /**
     * Route for all JS files and bundles. This route uses CacheFirst
     * strategy because if the file contents change, the file name will
     * change. There is no point in using StaleWhileRevalidate for JS files.
     */
    registerRoute(new RegExp(/\.js$/), new CacheFirst());

    /**
     * Route for HTML files. This route uses a custom plugin
     * to intercept all HTML file requests and return the response for
     * `index.html` which is the default file. This enables the app to have
     * offline capabilities by returning HTML for `index.html` irrespective
     * of the route that was requsted since all routes use same HTML file.
     *
     * Also the cacheName is the precache cache name configured on workbox.
     * This is because when a new version of the app is deployed, SW will be
     * updated with new assets and delete the old `index.html` file. This will
     * make sure that the SW will fetch the `index.html` file when the user
     * requests from the server the first time. From next time onwards, the
     * file from cache will be served till a new version of the app deployed
     * and the cycle repeats.
     */
    registerRoute(
        ({ url }) => url.origin === self.location.origin && isHTMLRoute(url),
        new StaleWhileRevalidate({
            plugins: [
                {
                    cacheKeyWillBeUsed: () => 'index.html'
                }
            ],
            cacheName: cacheNames.precache
        })
    );
}
