/**
 * These targets are available for interception to modules which depend on `@magento/venia-ui`.
 *
 * Their implementations are found in `./venia-ui-intercept.js`.
 *
 */
module.exports = targets => {
    targets.declare({
        /**
         * Provides access to the rich content renderers extension point.
         * 
         * This extension point collects rich content renderers contributed
         * by third party extensions.
         * It builds an array of these renderers, which Venia's RichContent
         * component uses to try and render a block of "rich" content, such
         * as HTML.
         *
         * @typedef richContentRenderers
         * @member {tapable.SyncHook}
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
         * Gives you access to the rich content renderers extensibility point
         *
         * @function richContentRenderers.tap
         *
         * @param {rendererInterceptFunction} intercept
         */

        /**
         * An interceptor function you define for the rich content renderers
         * extension point.
         *
         * @function rendererInterceptFunction
         * @param {RichContentRenderersAPI} renderers
         */

        /**
         * API for the rich content renderers extension point
         *
         * @typedef {Object} RichContentRenderersAPI
         */

        /**
         * Register a rich content renderer
         *
         * @function RichContentRendererAPI.add
         *
         * @param {RichContentRenderer} renderer
         */

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
         * Registers custom client-side routes for third-party extensions.
         * Venia uses the Peregrine MagentoRoute for most of the site;
         * catalog and CMS page URLs are controlled by admins, and dispatched
         * via the UrlResolver query.
         *
         * Venia also has some "static" routes for built-in pages, like cart
         * and checkout. With the `routes` target, you can inject additional
         * routes into Venia's main router.
         *
         * @typedef routes
         * @member {tapable.SyncHook}
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

        /**
         * Gives you access to the extensibility point for routes
         *
         * @function routes.tap
         *
         * @param {routesInterceptFunction} intercept
         */

        /**
         * An interceptor function you define for the routes extension point.
         * 
         * @function routesInterceptFunction
         * 
         * @param {VeniaRoute[]} routes - Array of registered routes
         * 
         * @returns {VeniaRoute[]} - Your function must return the array, or a new
         *   array you have constructed
         */

        /**
         * A description of a route in the Venia app structure.
         *
         * @typedef {Object} VeniaRoute
         * @property {string} name - Friendly name for the React component
         * @property {string} pattern - Route pattern. Will be used as the
         *   `<Route/>` component's `path` prop
         * @property {boolean} [exact] - Exactly match the route?
         * @property {string} path - Resolvable path to the component which the
         *   Route will render
         */
        routes: new targets.types.SyncWaterfall(['routes'])
    });
};
