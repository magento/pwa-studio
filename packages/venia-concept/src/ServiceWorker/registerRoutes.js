import {
    isResizedCatalogImage,
    findSameOrLargerImage,
    createCatalogCacheHandler
} from './Utilities/imageCacheHandler';
import { isHTMLRoute } from './Utilities/routeHandler';
import {
    ONE_DAY,
    THIRTY_DAYS,
    MAX_NUM_OF_IMAGES_TO_CACHE,
    IMAGES_CACHE_NAME,
    RUNTIME_CACHE_NAME
} from './defaults';
import { cacheHTMLPlugin } from './Utilities/htmlHandler';

/**
 * registerRoutes function contains all the routes that need to
 * be registered with workbox for caching and proxying.
 *
 * @returns {void}
 */
export default function() {
    const catalogCacheHandler = createCatalogCacheHandler();

    workbox.routing.registerRoute(
        new RegExp('(robots.txt|favicon.ico|manifest.json)'),
        new workbox.strategies.StaleWhileRevalidate()
    );

    /**
     * Route that checks for resized catalog images in cache.
     */
    workbox.routing.registerRoute(
        isResizedCatalogImage,
        ({ url, request, event }) => {
            const sameOrLargerImagePromise = findSameOrLargerImage(
                url,
                request
            );
            event.waitUntil(sameOrLargerImagePromise);
            return sameOrLargerImagePromise.then(
                response =>
                    response || catalogCacheHandler.handle({ request, event })
            );
        }
    );

    /**
     * Route to handle all types of images. Stores them in cache with a
     * cache name "images". They auto expire after 30 days and only 60
     * can be stored at a time.
     */
    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        new workbox.strategies.CacheFirst({
            cacheName: IMAGES_CACHE_NAME,
            plugins: [
                new workbox.expiration.Plugin({
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
     *
     * After 24 hours, the files will be purged from cache.
     */
    workbox.routing.registerRoute(
        new RegExp(/\.js$/),
        new workbox.strategies.CacheFirst({
            cacheName: RUNTIME_CACHE_NAME,
            plugins: [
                new workbox.expiration.Plugin({
                    maxAgeSeconds: ONE_DAY
                })
            ]
        })
    );

    /**
     * Route for HTML files. This route uses the cacheHTMLPlugin
     * to intercept all HTML file requests and return the file for
     * `/` which is the default file. This enables the app to have
     * offline capabilities by returning HTML for `/` irrespective
     * of the route that was requsted since all routes use same HTML file.
     *
     * After 24 hours, the HTML file will be purged from cache.
     */
    workbox.routing.registerRoute(
        ({ url }) => isHTMLRoute(url),
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: RUNTIME_CACHE_NAME,
            plugins: [
                cacheHTMLPlugin,
                new workbox.expiration.Plugin({
                    maxAgeSeconds: ONE_DAY
                })
            ]
        })
    );
}
