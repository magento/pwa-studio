import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/swMessageTypes';

import { sendMessageToWindow } from './messageHandler';

const cloneRequestWithDiffURL = (request, url) =>
    url
        ? new Request(url, {
              method: request.method,
              headers: request.headers
          })
        : request;

/**
 * cacheHTMLPlugin is a workbox plugin that will apply request
 * and reponse manipulations on HTML routes.
 */
export const cacheHTMLPlugin = {
    cacheKeyWillBeUsed: async () => {
        /**
         * For all read and writes that arrive on any HTML route
         * return `/`.
         */
        return '/';
    },
    requestWillFetch: async ({ request }) => {
        /**
         * Clone the request with url as `/`.
         */
        const newRequest = cloneRequestWithDiffURL(request, '/');

        return newRequest;
    },
    fetchDidSucceed: async ({ request, response }) => {
        /**
         * Check if there is a response cached for the request
         * URL. If yes, compare the content of both the cached
         * response and the new response. If they are different
         * send a the `HTML_UPDATE_AVAILABLE` message to window.
         */
        const cachedResponseObj = await caches.match(
            new URL(request.url).pathname
        );
        if (cachedResponseObj) {
            const cachedResponse = await cachedResponseObj.text();
            const clonedResponse = await response.clone().text();
            if (cachedResponse !== clonedResponse) {
                sendMessageToWindow(HTML_UPDATE_AVAILABLE);
            }
        }
        return response;
    }
};
