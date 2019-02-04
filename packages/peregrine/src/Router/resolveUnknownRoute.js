/**
 * @description Given a route string, resolves with the "standard route", along
 * with the assigned Root Component (and its owning chunk) from the backend
 * @param {{ route: string, apiBase: string, __tmp_webpack_public_path__: string}} opts
 */

// Some M2.3.0 GraphQL node IDs are numbers and some are strings, so explicitly
// cast numbers if they appear to be numbers
const numRE = /^\d+$/;
const castDigitsToNum = str =>
    typeof str === 'string' && numRE.test(str) ? Number(str) : str;
export default async function resolveUnknownRoute(opts) {
    const { route, apiBase } = opts;

    if (!resolveUnknownRoute.preloadDone) {
        resolveUnknownRoute.preloadDone = true;

        // Templates may use the new style (data attributes on the body tag),
        // or the old style (handwritten JSON in a script element).

        // New style:
        const preloadAttrs = document.body.dataset;
        if (preloadAttrs && preloadAttrs.modelType) {
            return {
                type: preloadAttrs.modelType,
                id: castDigitsToNum(preloadAttrs.modelId)
            };
        }

        // Old style:
        const preloadScript = document.getElementById('url-resolver');
        if (preloadScript) {
            try {
                const preload = JSON.parse(preloadScript.textContent);
                return {
                    type: preload.type,
                    id: castDigitsToNum(preload.id)
                };
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
 * @description Checks if route is stored in localStorage, if not call `fetchRoute`
 * @param {{ route: string, apiBase: string}} opts
 * @returns {Promise<{type: "PRODUCT" | "CATEGORY" | "CMS_PAGE"}>}
 */
function remotelyResolveRoute(opts) {
    let urlResolve = localStorage.getItem('urlResolve');
    urlResolve = JSON.parse(urlResolve);

    // If it exists in localStorage, use that value
    // TODO: This can be handled by workbox once this issue is resolved in the
    // graphql repo: https://github.com/magento/graphql-ce/issues/229
    if ((urlResolve && urlResolve[opts.route]) || !navigator.onLine) {
        if (urlResolve && urlResolve[opts.route]) {
            return Promise.resolve(urlResolve[opts.route].data.urlResolver);
        } else {
            return Promise.resolve({
                type: 'NOTFOUND',
                id: -1
            });
        }
    } else {
        return fetchRoute(opts);
    }
}

/**
 * @description Calls the GraphQL API for results from the urlResolver query
 * @param {{ route: string, apiBase: string}} opts
 * @returns {Promise<{type: "PRODUCT" | "CATEGORY" | "CMS_PAGE"}>}
 */
function fetchRoute(opts) {
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
        .then(res => {
            storeURLResolveResult(res, opts);
            return res.data.urlResolver;
        });
}

// TODO: This can be handled by workbox once this issue is resolved in the
// graphql repo: https://github.com/magento/graphql-ce/issues/229
function storeURLResolveResult(res, opts) {
    const storedRoute = localStorage.getItem('urlResolve');
    const item = JSON.parse(storedRoute) || {};

    item[opts.route] = res;
    localStorage.setItem('urlResolve', JSON.stringify(item));
}
