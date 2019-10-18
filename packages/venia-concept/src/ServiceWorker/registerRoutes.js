import {
    isResizedCatalogImage,
    findSameOrLargerImage
} from './Utilities/imageCacheHandler';
import { isHTMLRoute } from './Utilities/routeHandler';
import { createCatalogCacheHandler } from './Utilities/catalogCacheHandler';
import { THIRTY_DAYS, MAX_NUM_OF_IMAGES_TO_CACHE } from './defaults';
import { cacheHTMLPlugin } from './Utilities/htmlHandler';

export default function() {
    const catalogCacheHandler = createCatalogCacheHandler();

    workbox.routing.registerRoute(
        new RegExp('(robots.txt|favicon.ico|manifest.json)'),
        new workbox.strategies.StaleWhileRevalidate()
    );

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

    workbox.routing.registerRoute(
        /\.(?:png|gif|jpg|jpeg|svg)$/,
        new workbox.strategies.CacheFirst({
            cacheName: 'images',
            plugins: [
                new workbox.expiration.Plugin({
                    maxEntries: MAX_NUM_OF_IMAGES_TO_CACHE, // 60 Images
                    maxAgeSeconds: THIRTY_DAYS // 30 Days
                })
            ]
        })
    );

    workbox.routing.registerRoute(
        new RegExp(/\.js$/),
        new workbox.strategies.CacheFirst()
    );

    workbox.routing.registerRoute(
        ({ url }) => isHTMLRoute(url),
        new workbox.strategies.StaleWhileRevalidate({
            plugins: [cacheHTMLPlugin]
        })
    );
}
