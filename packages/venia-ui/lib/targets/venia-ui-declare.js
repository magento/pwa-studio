/**
 * These targets are available for interception to modules which depend on `@magento/venia-ui`.
 *
 * Their implementations are found in `./venia-ui-intercept.js`.
 *
 * @module VeniaUI/Targets
 */
module.exports = targets => {
    targets.declare({
        /**
         * A file that implements the RichContentRenderer interface.
         *
         * @typedef {Object} RichContentRenderer
         * @property {string} componentName - Friendly name for the React
         *   component, for debugging purposes.
         * @property {string} importPath - Path to the implementation file.
         *   Can be anything the resolves with an `import` statement.
         */

        /**
         * Registers RichContentRenderers by putting them in an array.
         *
         * @typedef {Object} RichContentRendererCollection
         * @method add - Register a RichContentRenderer.
         * @param {RichContentRenderer} renderer
         */

        /**
         * @callback rendererIntercept
         * @param {RichContentRendererCollection} renderers
         * @returns {undefined} - Interceptors of `richContentRenderers` can
         *   call `renderers.add()` and not return anything.
         */

        /**
         * Collects RichContentRenderers contributed by third party extensions.
         * Builds an array of these renderers which Venia's RichContent
         * component uses to try and render a block of "rich" content, most
         * likely HTML.
         *
         * @type {tapable.SyncHook}
         * @param {rendererIntercept} callback
         *
         * @example <caption>Add a renderer from this package.</caption>
         * targets.of('@magento/venia-ui').richContentRenderers.tap(
         *   renderers => renderers.add({
         *     componentName: 'AdobeXM',
         *     importPath: '@adobe/xm-components/xm-renderer'
         *   })
         * )
         */
        richContentRenderers: new targets.types.Sync(['renderers']),

        /**
         * A description of a route in the Venia app structure.
         *
         * @typedef {Object} VeniaRoute
         * @property {string} name - Friendly name for the React component.
         * @property {string} pattern - Route pattern. Will be used as the
         *   `<Route/>` component's `path` prop.
         * @property {boolean} [exact] - Exactly match the route?
         * @property {string} path - Resolvable path to the component which the
         *   Route will render.
         */

        /**
         * @callback routesIntercept
         * @param {VeniaRoute[]} routes - Array of registered routes.
         * @returns {VeniaRoute[]} - You must return the array, or a new
         *   array you have constructed.
         */

        /**
         * Registers custom client-side routes for third-party extensions.
         * Venia uses the Peregrine MagentoRoute for most of the site;
         * catalog and CMS page URLs are controlled by admins, and dispatched
         * via the UrlResolver query.
         *
         * Venia also has some "static" routes for built-in pages, like cart
         * and checkout. With the `routes` target, you can inject additional
         * routes into Venia's main router.
         *
         * @example <caption>Add a custom route for a blog module.</caption>
         * targets.of('@magento/venia-ui').routes.tap(routes => {
         *   routes.push({
         *     name: 'Blog',
         *     pattern: '/blog/:slug/:id',
         *     path: '@partner/pwa-studio-blog'
         *   });
         *   return routes;
         * })
         */
        routes: new targets.types.SyncWaterfall(['routes'])
    });
};
