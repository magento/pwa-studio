/**
 * @description Given a route string, resolves with the "standard route", along
 * with the assigned Root Component (and its owning chunk) from the backend
 * @param {{ route: string, apiBase: string, __tmp_webpack_public_path__: string}} opts
 */
const numRE = /^\d+$/;
export default async function resolveUnknownRoute(opts) {
    const { route, apiBase } = opts;

    if (!resolveUnknownRoute.preloadDone) {
        resolveUnknownRoute.preloadDone = true;
        const preloaded = document.getElementById('url-resolver');
        if (preloaded) {
            try {
                const preload = JSON.parse(preloaded.textContent);
                // UPWARD treats most values as strings, so explicitly cast
                // numbers if they appear to be numbers
                if (typeof preload.id === 'string' && numRE.test(preload.id)) {
                    return {
                        type: preload.type,
                        id: Number(preload.id)
                    };
                }
                return preload;
            } catch (e) {
                // istanbul ignore next: will never happen in test
                if (process.env.NODE_ENV === 'development') {
                    console.error(
                        'Unable to read preload!',
                        preloaded.textContent,
                        e
                    );
                }
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
