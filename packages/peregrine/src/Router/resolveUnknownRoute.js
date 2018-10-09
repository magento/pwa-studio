/**
 * @description Given a route string, resolves with the "standard route", along
 * with the assigned Root Component (and its owning chunk) from the backend
 * @param {{ route: string, apiBase: string, __tmp_webpack_public_path__: string}} opts
 * @returns {Promise<{matched: boolean, rootChunkID: number | undefined, rootModuleID: number | undefined, id: number }>}
 */
export default function resolveUnknownRoute(opts) {
    const { route, apiBase, __tmp_webpack_public_path__ } = opts;
    if ( route === '/search'){
        return tempGetWebpackChunkData(
            'CATEGORY',
            __tmp_webpack_public_path__
        ).then(({ rootChunkID, rootModuleID }) => ({
            rootChunkID,
            rootModuleID,
            id: 99,
            matched: true
        }));
    }
    else {
      return remotelyResolveRoute({
          route,
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
              id: res.id,
              matched: true
          }));
      });
  }
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

/**
 * @description This is temporary until we have proper support in the backend
 * and the GraphQL API for storing/retrieving the assigned Root Component for a route.
 * For now, we fetch the manifest manually, and just grab the first RootComponent
 * that is compatible with the current pageType
 * @param {"PRODUCT" | "CATEGORY" | "CMS_PAGE"} pageType
 * @returns {Promise<{rootChunkID: number, rootModuleID: number}>}
 */
function tempGetWebpackChunkData(pageType, webpackPublicPath) {
    // In dev mode, `webpackPublicPath` may be a fully qualified URL.
    // In production mode, it may be a pathname, which makes it unsafe
    // to use as an API base. Normalize it as a full path using a DOM node
    // as a native URL parser.
    const parser = document.createElement('a');
    parser.setAttribute('href', webpackPublicPath);
    return fetch(new URL('roots-manifest.json', parser.href))
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
