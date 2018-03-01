/**
 * @description Given a route string, resolves with the "standard route", along
 * with the assigned Root Component (and its owning chunk) from the backend
 * @param {{ route: string, apiBase: string, __tmp_webpack_public_path__: string}} opts
 * @returns {Promise<{matched: boolean, rootChunkID: number | undefined, rootModuleID: number | undefined }>}
 */
export default function resolveUnknownRoute(opts) {
    const { route, apiBase, __tmp_webpack_public_path__ } = opts;

    return remotelyResolveRoute({
        // urlResolver GraphQL query currently fails if a leading slash exists.
        // This code can be removed after this bug is fixed:
        // https://jira.corp.magento.com/browse/MAGETWO-87425
        route: route[0] === '/' ? route.slice(1) : route,
        apiBase
    }).then(res => {
        if (!(res && res.type)) {
            return { matched: false };
        }
        return tempGetWebpackChunkData(
            res.type,
            __tmp_webpack_public_path__
        ).then(({ rootChunkID, rootModuleID }) => ({
            rootChunkID,
            rootModuleID,
            matched: true
        }));
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
                    }
                }
            `.trim()
        })
    })
        .then(res => res.json())
        .then(res => res.data.urlResolver);
}

/**
 * @description This is temporary until we have proper support in the backend
 * and the GraphQL API for storing/retrieving the assigned Root Component for a route.
 * For now, we fetch the manifest manually, and just grab the first RootComponent
 * that is compatible with the current pageType
 * @param {"PRODUCT" | "CATEGORY" | "CMS_PAGE"} pageType
 * @returns {Promise<{rootChunkID: number, rootModuleID: number}>}
 */
function tempGetWebpackChunkData(pageType, webpackPublicPath) {
    return fetch(new URL('roots-manifest.json', webpackPublicPath))
        .then(res => res.json())
        .then(manifest => {
            const firstCompatibleConfig = Object.values(manifest).find(conf => {
                return conf.pageTypes.some(type => type === pageType);
            });

            if (!firstCompatibleConfig) {
                throw new Error(
                    `Could not find RootComponent for pageType ${pageType}`
                );
            }

            return {
                rootChunkID: firstCompatibleConfig.rootChunkID,
                rootModuleID: firstCompatibleConfig.rootModuleID
            };
        });
}
