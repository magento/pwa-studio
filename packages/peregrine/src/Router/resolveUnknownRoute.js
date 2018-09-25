/**
 * @description Given a route string, resolves with the "standard route", along
 * with the assigned Root Component (and its owning chunk) from the backend
 * @param {{ route: string, apiBase: string, __tmp_webpack_public_path__: string}} opts
 */
let preloadDone = false;
export default function resolveUnknownRoute(opts) {
    const { route, apiBase } = opts;

    if (!preloadDone) {
        const preloaded = document.getElementById('url-resolver');
        if (preloaded) {
            try {
                const preloadedJson = JSON.parse(preloaded.textContent);
                preloadDone = true;
                return Promise.resolve(preloadedJson);
            } catch (e) {
                console.error(
                    'Unable to read preload!',
                    preloaded.textContent,
                    e
                );
            }
        }
    }
    return remotelyResolveRoute({
        route,
        apiBase
    });
}

/**
 * @description Calls the GraphQL API for results from the urlResolver query
 * @param {{ route: string, apiBase: string}} opts
 * @returns {Promise<{type: "PRODUCT" | "CATEGORY" | "CMS_PAGE"}>}
 */
function remotelyResolveRoute(opts) {
    const url = new URL('/graphql', opts.apiBase);
    return fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            query: `
                {
                    urlResolver(url: "${opts.route}") {
                        type
                        id
                    }
                }
            `.trim()
        })
    })
        .then(res => res.json())
        .then(res => res.data.urlResolver);
}
