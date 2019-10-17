import { HTML_UPDATE_AVAILABLE } from '@magento/venia-ui/lib/constants/messageTypes';

import { sendMessageToWindow } from './messageHandler';

const cloneRequestWithDiffURL = (request, url) =>
    url
        ? new Request(url, {
              method: request.method,
              headers: request.headers
          })
        : request;

export const cacheHTMLPlugin = {
    cacheKeyWillBeUsed: async () => {
        return '/';
    },
    requestWillFetch: async ({ request }) => {
        const newRequest = cloneRequestWithDiffURL(request, '/');

        return newRequest;
    },
    fetchDidSucceed: async ({ response }) => {
        const cachedResponseObj = await caches.match('/');
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
