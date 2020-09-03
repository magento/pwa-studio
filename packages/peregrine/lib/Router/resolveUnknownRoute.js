import BrowserPersistence from '../util/simplePersistence';
/**
 * @description Given a route string, resolves with the "standard route", along
 * with the assigned Root Component (and its owning chunk) from the backend
 * @param {{ route: string, apiBase: string, __tmp_webpack_public_path__: string}} opts
 */
const persistence = new BrowserPersistence();

/**
 * Retrieve the route cache key for a store
 *
 * @param store
 * @returns {*}
 */
function getRouteCacheKey(store) {
    return 'urlResolver' + (store ? `_${store}` : '');
}

// Some M2.3.0 GraphQL node IDs are numbers and some are strings, so explicitly
// cast numbers if they appear to be numbers
const numRE = /^\d+$/;
const castDigitsToNum = str =>
    typeof str === 'string' && numRE.test(str) ? Number(str) : str;
export default async function resolveUnknownRoute(opts) {
    const { route, apiBase, store } = opts;

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
        apiBase,
        store
    });
}

/**
 * @description Checks if route is stored in localStorage, if not call `fetchRoute`
 * @param {{ route: string, apiBase: string, store: string }} opts
 * @returns {Promise<{type: "PRODUCT" | "CATEGORY" | "CMS_PAGE"}>}
 */
function remotelyResolveRoute(opts) {
    const urlResolve = persistence.getItem(getRouteCacheKey(opts.store));

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
 * @description Calls remote endpoints to see if anything can handle this route.
 * @param {{ route: string, apiBase: string, store: ?string }} opts
 * @returns {Promise<{type: "PRODUCT" | "CATEGORY" | "CMS_PAGE"}>}
 */
function fetchRoute(opts) {
    const query = `query ResolveURL($url: String!) {
        urlResolver(url: $url) {
            type
            id
            relative_url
            redirectCode
        }
    }`;

    const url = new URL('/graphql', opts.apiBase);
    url.searchParams.set('query', query);
    url.searchParams.set('variables', JSON.stringify({ url: opts.route }));
    url.searchParams.set('operationName', 'ResolveURL');

    const headers = {
        'Content-Type': 'application/json'
    };

    // If the store is provided include it as part of the request
    if (opts.store) {
        headers['Store'] = opts.store;
    }

    return fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: new Headers(headers)
    })
        .then(res => res.json())
        .then(res => {
            if (res.errors) {
                throw new Error(
                    `urlResolver query failed: ${JSON.stringify(
                        res.errors,
                        null,
                        2
                    )}`
                );
            }

            const routes =
                persistence.getItem(getRouteCacheKey(opts.store)) || {};
            routes[opts.route] = res;
            persistence.setItem(getRouteCacheKey(opts.store), routes, 86400);
            // entire route cache has a TTL of one day

            return res.data.urlResolver;
        });
}
