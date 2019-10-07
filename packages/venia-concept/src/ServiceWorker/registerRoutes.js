import {
    isResizedCatalogImage,
    findSameOrLargerImage
} from './Utilities/imageCacheHandler';
import { createCatalogCacheHandler } from './Utilities/catalogCacheHandler';
import { THIRTY_DAYS, MAX_NUM_OF_IMAGES_TO_CACHE } from './defaults';

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
        new RegExp('/.\\.js$'),
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.registerRoute(
        new RegExp('\\.html$'),
        new workbox.strategies.NetworkFirst()
    );
    workbox.routing.registerRoute(
        '/',
        new workbox.strategies.StaleWhileRevalidate()
    );
}
