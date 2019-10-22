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
    }
};
