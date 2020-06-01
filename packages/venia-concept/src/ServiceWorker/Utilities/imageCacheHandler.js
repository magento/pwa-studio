import { PREFETCH_IMAGES } from '@magento/venia-ui/lib/constants/swMessageTypes';

import { isFastNetwork } from './networkUtils';
import { THIRTY_DAYS, CATALOG_CACHE_NAME } from '../defaults';
import { registerMessageHandler } from './messageHandler';

const getWidth = url => Number(new URLSearchParams(url.search).get('width'));

const isCatalogImage = ({ url }) => url.pathname.startsWith('/media/catalog');

/**
 * isResizedCatalogImage is route checker for workbox
 * that returns true for a valid catalog image URL.
 *
 * @param {url: URL, event: FetchEvent} workboxRouteObject
 *
 * @returns {boolean}
 */
export const isResizedCatalogImage = ({ url }) =>
    isCatalogImage({ url }) && !isNaN(getWidth(url));

/**
 * This function tries to find same or a larger image
 * from the catalog cache storage.
 *
 * @param {URL} url
 *
 * @returns {Promise | undefined} A promise that resolves to a valid response
 * object from cache or undefined if the a match could not be found.
 */
export const findSameOrLargerImage = async url => {
    const requestedWidth = getWidth(url);
    const requestedFilename = url.pathname.split('/').reverse()[0];

    const cache = await caches.open(CATALOG_CACHE_NAME);
    const cachedURLs = await cache.keys();
    const cachedSources = await cachedURLs.filter(({ url }) => {
        const cachedFileName = new URL(url).pathname.split('/').reverse()[0];

        return cachedFileName === requestedFilename;
    });

    // Find the cached version of this image that is closest to the requested
    // width without going under it.
    let best = { difference: Infinity, candidate: null };
    for (const candidate of cachedSources) {
        const width = getWidth(new URL(candidate.url));
        /**
         * If the cached image has no resize param continue because
         * we can't safely use it
         */
        if (isNaN(width)) {
            continue;
        }

        const difference = width - requestedWidth;

        /**
         * If cached image is smaller than requested continue because
         * we can't safely use it
         */
        if (difference < 0) {
            continue;
        }

        /**
         * If the cached image is same as what we are looking for, return.
         */
        if (difference === 0) {
            return await cache.match(candidate);
        }

        /**
         * If the cached image is larger than what we saw till now, update
         * the candidate and keep looking for a better version.
         */
        if (difference < best.difference) {
            best = {
                difference,
                candidate
            };
        }
    }
    if (best.candidate) {
        const bestCachedResponse = await cache.match(best.candidate);
        console.log(
            `ServiceWorker responding to GET ${
                url.pathname
            } at ${requestedWidth}w with cached version ${
                best.difference
            }px larger: ${bestCachedResponse.url}`
        );
        return bestCachedResponse;
    }
};

const fetchAndCacheImage = imageURL =>
    fetch(imageURL, { mode: 'no-cors' }).then(response =>
        caches
            .open(CATALOG_CACHE_NAME)
            .then(cache => cache.put(imageURL, response.clone()))
            .then(() => response)
    );

const fetchIfNotCached = imageURL =>
    new Promise(resolve => {
        caches.match(imageURL).then(res => {
            res ? resolve(res) : resolve(fetchAndCacheImage(imageURL));
        });
    });

const handleImagePreFetchRequest = (payload, event) => {
    if (isFastNetwork()) {
        return Promise.all(payload.urls.map(fetchIfNotCached))
            .then(responses => {
                event.ports[0].postMessage({ status: 'done' });
                return responses;
            })
            .catch(err => {
                event.ports[0].postMessage({
                    status: 'error',
                    message: JSON.stringify(err)
                });
                return null;
            });
    } else {
        event.ports[0].postMessage({
            status: 'error',
            message: `Slow Network detected. Not pre-fetching images. ${
                payload.urls
            }`
        });
        return null;
    }
};

/**
 * This function registers all message handlers related to
 * image prefetching.
 *
 * Messages it registers handlers to:
 *
 * 1. PREFETCH_IMAGES
 */
export const registerImagePreFetchHandler = () => {
    registerMessageHandler(PREFETCH_IMAGES, handleImagePreFetchRequest);
};

/**
 * This function creates a handler that workbox can use
 * to handle all catalog images.
 */
export const createCatalogCacheHandler = () =>
    new workbox.strategies.CacheFirst({
        cacheName: CATALOG_CACHE_NAME,
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: THIRTY_DAYS
            }),
            new workbox.cacheableResponse.Plugin({
                statuses: [0, 200]
            })
        ]
    });
