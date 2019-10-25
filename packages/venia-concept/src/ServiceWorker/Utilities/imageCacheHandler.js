import { PREFETCH_IMAGES } from '@magento/venia-ui/lib/constants/swMessageTypes';

import { isFastNetwork } from './networkUtils';
import { CATALOG_CACHE_NAME } from '../defaults';
import { registerMessageHandler } from './messageHandler';

const getWidth = url => Number(new URLSearchParams(url.search).get('width'));

const isCatalogImage = ({ url }) => url.pathname.startsWith('/media/catalog');

export const isResizedCatalogImage = ({ url }) =>
    isCatalogImage({ url }) && !isNaN(getWidth(url));

export const findSameOrLargerImage = async (url, request) => {
    const requestedWidth = getWidth(url);

    const cache = await caches.open(CATALOG_CACHE_NAME);
    const cachedSources = await cache.matchAll(request, {
        ignoreSearch: true
    });

    // Find the cached version of this image that is closest to the requested
    // width without going under it.
    let best = { difference: Infinity, candidate: null };
    for (const candidate of cachedSources) {
        const width = getWidth(new URL(candidate.url));
        if (isNaN(width)) {
            // cached image has no resize param, so we can't safely use it
            continue;
        }

        const difference = width - requestedWidth;

        if (difference < 0) {
            // cached image is smaller than requested, so we can't safely use it
            continue;
        }

        if (difference === 0) {
            // cached image is exactly what we want, so shortcut to this one
            return candidate;
        }

        // we now know the cached image is larger than requested, but we don't
        // want to serve an unnecessarily large image if a smaller one is
        // available, to save device processing power and memory
        if (difference < best.difference) {
            // cached image is larger than requested, but smaller than the
            // previous existing match
            best = {
                difference,
                candidate
            };
        }
    }
    if (best.candidate) {
        console.log(
            `ServiceWorker responding to GET ${
                url.pathname
            } at ${requestedWidth}w with cached version ${
                best.difference
            }px larger: ${best.candidate.url}`
        );
        return best.candidate;
    }
};

const handleImagePreFetchRequest = (payload, event) => {
    if (isFastNetwork()) {
        return Promise.all(
            payload.urls.map(imageURL =>
                fetch(imageURL).then(response =>
                    caches
                        .open('catalog')
                        .then(cache =>
                            cache
                                .put(imageURL, response.clone())
                                .then(() => response)
                        )
                )
            )
        )
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
export const registerImagePreFetchHandler = () => {
    registerMessageHandler(PREFETCH_IMAGES, handleImagePreFetchRequest);
};
