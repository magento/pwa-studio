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
                console.log('responses are different');
            } else {
                console.log('responses are same');
            }
        }
        return response;
    }
};
