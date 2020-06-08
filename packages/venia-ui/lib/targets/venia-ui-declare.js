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
         * This target collects rich content renderers contributed by third
         * party extensions.
         * It builds an array of these renderers, which Venia's RichContent
         * component uses to try and render a block of "rich" content, such
         * as HTML.
         *
         * @typedef richContentRenderers
         * @member {tapable.SyncHook}
         *
         * @see [`richContentRenderers.tap()`]{@link richContentRenderers.tap}
         * @see [Intercept function signature]{@link rendererInterceptFunction}
         * @see [RichContentRenderers API]{@link RichContentRenderersAPI}
         * @see [RichContentRenderer configuration]{@link RichContentRenderer}
         *
         * @example <caption>Access the tapable object</caption>
         * const veniaTargets = targets.of('@magento/venia-ui')
         * const richContentRenderers = veniaTargets.richContentRenderers
         *
         * @example <caption>Add a renderer</caption>
         * richContentRenderers.tap(
         *   renderersApi => renderersApi.add({
         *     componentName: 'AdobeXM',
         *     importPath: '@adobe/xm-components/xm-renderer'
         *   })
         * )
         */
        richContentRenderers: new targets.types.Sync(['renderers']),

        /**
         * Provides access to Venia's routing logic.
         *
         * This target lets you add new routes to your storefronts.
         * You can also modify the existing routes that come with Venia,
         * such as cart or checkout URLs.
         *
         * NOTE: This target does not include routes controlled by the Magento
         * admin, such as CMS or catalog URLs.
         *
         * @typedef routes
         * @member {tapable.SyncHook}
         *
         * @see [`routes.tap()`]{@link routes.tap}
         * @see [Intercept function signature]{@link routesInterceptFunction}
         * @see [Route definition object]{@link RouteDefinition}
         *
         * @example <caption>Access the tapable object</caption>
         * const veniaTargets = targets.of('@magento/venia-ui')
         * const routes = veniaTargets.routes
         *
         * @example <caption>Add a custom route for a blog module</caption>
         * routes.tap(
         *   routesArray => {
         *      routesArray.push({
         *          name: 'Blog',
         *          pattern: '/blog/:slug/:id',
         *          path: '@partner/pwa-studio-blog'
         *      });
         *      return routesArray;
         *   })
         */
        routes: new targets.types.SyncWaterfall(['routes'])
    });
};

/** Type definitions related to: richContentRenderers */

/**
 * The `tap()` function gives you access to the rich content renderers extensibility point
 * through a [callback function]{@link rendererInterceptFunction} you define in your project.
 *
 * @function richContentRenderers.tap
 *
 * @param {rendererInterceptFunction} intercept A callback function which uses the {@link RichContentRenderersAPI}
 *
 * @example
 * const richContentRenderers = veniaTargets.richContentRenderers
 *
 * richContentRenderers.tap(renderersApi => {
 *      // Intercept logic
 * });
 */

/**
 * The renderer intercept function is a callback defined in your project's
 * intercept file.
 *
 * This function has access to the {@link RichContentRendererAPI} when passed to the
 * [`richContentRenderers.tap()`]{@link richContentRenderers.tap} function.
 *
 * @callback rendererInterceptFunction
 *
 * @param {RichContentRenderersAPI} renderersApi The API for the extension point
 *
 * @example
 * const intercept = renderersApi => {
 *      renderersApi.add({
 *          componentName: 'MyRenderer',
 *          importPath: 'my-ui-library/my-renderer'
 *      });
 * }
 */

/**
 * The API object for the rich content renderers extension point.
 * It is the parameter provided for [renderer intercept]{@link rendererInterceptFunction}
 * callback functions.
 *
 * @namespace {Object} RichContentRenderersAPI
 * @kind typedef
 */

/**
 * Register a rich content renderer
 *
 * @memberof RichContentRenderersAPI
 *
 * @function add
 *
 * @param {RichContentRenderer} renderer Object that describes a custom rich content renderer
 *   module to import
 *
 * @example
 * const intercept = renderersApi => {
 *      const renderer = {
 *          componentName: 'MyRenderer',
 *          importPath: 'my-ui-library/my-renderer'
 *      }
 *
 *      renderersApi.add(renderer);
 * }
 */

/**
 * A configuration object that describes module which implements
 * the RichContentRenderer interface.
 *
 * @typedef {Object} RichContentRenderer
 *
 * @property {string} componentName Friendly name for the React
 *   component. This is used for debugging purposes.
 * @property {string} importPath Path to the implementation file.
 *   The value is anything that can be resolved by an `import` statement.
 *
 * @example
 * const renderer = {
 *   componentName: 'AdobeXM',
 *   importPath: '@adobe/xm-components/xm-renderer'
 * }
 */

/** Type definition related to: routes */

/**
 * The `tap()` function gives you access to the routes extensibility point
 * through a [callback function]{@link routesInterceptFunction} you define in your project.
 *
 * @function routes.tap
 *
 * @param {routesInterceptFunction} intercept A callback function which returns an array of routes
 *
 * @example
 * const routes = veniaTargets.routes
 *
 * routes.tap(routesArray => {
 *      // Intercept logic
 * })
 */

/**
 * The routes intercept function is a callback defined in your project's
 * intercept file.
 *
 * This function has access to an array of {@link VeniaRoute} objects when passed to the
 * [`routes.tap()`]{@link routes.tap} function.
 * It must return a modified version of this array or a new array you construct.
 *
 * @callback routesInterceptFunction
 *
 * @param {RouteDefinition[]} routes Array of registered routes
 *
 * @returns {RouteDefinition[]} Your function must return the modified array, or a new
 *   array you have constructed
 *
 * @example
 * const intercept = routesArray => {
 *      // Modify the routesArray
 *
 *      return routesArray;
 * }
 */

/**
 * A route definition object that describes a route in your storefront.
 *
 * @typedef {Object} RouteDefinition
 * @property {string} name Friendly name for the React component
 * @property {string} path Resolvable path to the component the
 *   Route component will render
 * @property {string} pattern Route pattern. This is used as the
 *   `path` prop for the `<Route/>` component.
 * @property {boolean} [exact] Tells the router whether it should match the route
 *   exactly or not. This property is optional.
 *
 * @example <caption>A custom route with a URL parameter</caption>
 * const myCustomRoute = {
 *      name: 'MyRoute',
 *      pattern: '/my-route/:myRouteParam',
 *      path: '@my-components/my-route-component'
 * }
 */
