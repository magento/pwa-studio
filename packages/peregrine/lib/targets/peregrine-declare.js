/**
 * These targets are available for interception to modules which depend on `@magento/peregrine`.
 *
 * Their implementations are found in `./peregrine-intercept.js`.
 *
 */
module.exports = targets => {
    targets.declare({
        /**
         * Provides access to Peregrine React hooks.
         *
         * This target collects requests to intercept and "wrap" individual Peregrine
         * hooks in decorator functions.
         *
         * Use this target to run custom code whenever the application calls a
         * Peregrine hook.
         * You can also use this target to modify the behavior or output returned by
         * a hook.
         *
         *
         * @member {tapable.AsyncSeriesHook}
         *
         * @see [Intercept function signature]{@link hookInterceptFunction}
         *
         * @example <caption>Access the tapable object</caption>
         * const peregrineTargets = targets.of('@magento/peregrine');
         * const hooksTarget = peregrineTargets.hooks;
         *
         * @example <caption>Wrap the `useAwaitQuery()` hook  with a logging extension</caption>
         *
         * hooksTargets.tap( => {
         *   hook.useAwaitQuery.wrapWith('@my-extensions/log-wrapper');
         * })
         */
        hooks: new targets.types.AsyncSeries(['hooks']),
        /**
         * Provides access to Peregrine talon wrappers.
         *
         * This target collects requests to intercept and "wrap" individual Peregrine
         * talons in decorator functions.
         *
         * Use this target to run custom code whenever the application calls a
         * Peregrine talon.
         * You can also use this target to modify the behavior or output returned by
         * a talon.
         *
         *
         * @member {tapable.AsyncSeriesHook}
         *
         * @see [Intercept function signature]{@link hookInterceptFunction}
         *
         * @example <caption>Access the tapable object</caption>
         * const peregrineTargets = targets.of('@magento/peregrine');
         * const talonsTarget = peregrineTargets.talons;
         *
         * @example <caption>Wrap the `useApp()` hook  with a logging extension</caption>
         *
         * talonsTarget.tap(talons => {
         *   talons.App.useApp.wrapWith('@my-extensions/log-wrapper');
         * })
         */
        talons: new targets.types.AsyncSeries(['talons']),
        /**
         * Provides access to the list of rendering strategies used by the
         * RichContent component.
         *
         * This target collects a list of RichContentRenderer modules.
         * It builds an array of these renderers, which Venia's RichContent
         * component uses to try and render a block of "rich" content, such
         * as HTML.
         *
         * Use this target if your backend system uses a customized content
         * storage format instead of plain HTML in "rich content" fields such
         * as product descriptions and CMS blocks.
         *
         * @member {tapable.SyncHook}
         *
         * @see [Intercept function signature]{@link rendererInterceptFunction}
         * @see [RichContentRendererList]{@link #RichContentRendererList}
         * @see [RichContentRenderer]{@link RichContentRenderer}
         *
         * @example <caption>Add a renderer</caption>
         * targets.of('@magento/venia-ui').richContentRenderers.tap(
         *   renderers => renderers.add({
         *     componentName: 'AdobeXM',
         *     importPath: '@adobe/xm-components/xm-renderer'
         *   })
         * );
         */
        richContentRenderers: new targets.types.Sync(['renderers']),

        /**
         * Provides access to Venia's routing table.
         *
         * This target lets you add new routes to your storefronts.
         * You can also modify Venia's existing client-side routes,
         * such as cart or checkout URLs.
         *
         * NOTE: This target does not include routes controlled by the Magento
         * admin, such as CMS or catalog URLs.
         *
         * @member {tapable.AsyncSeriesWaterfall}
         *
         * @see [Intercept function signature]{@link routesInterceptFunction}
         * @see [Route definition object]{@link RouteDefinition}
         *
         * @example <caption>Add a custom route for a blog module</caption>
         * const veniaTargets = targets.of('@magento/venia-ui')
         * const routes = veniaTargets.routes
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
        routes: new targets.types.AsyncSeriesWaterfall(['routes']),

        /**
         * Provides access to Venia's checkout page payment methods
         *
         * This target lets you add new checkout page payment to your storefronts.
         *
         * @member {tapable.SyncHook}
         *
         * @see [Intercept function signature]{@link paymentInterceptFunction}
         * @see [CheckoutPaymentTypes]{@link #CheckoutPaymentTypesDefinition}
         * @see [CheckoutPayment definition object]{@link CheckoutPaymentDefinition}
         *
         * @example <caption>Add a payment</caption>
         * targets.of('@magento/venia-ui').checkoutPagePaymentTypes.tap(
         *   checkoutPagePaymentTypes => checkoutPagePaymentTypes.add({
         *     paymentCode: 'braintree',
         *     importPath: '@magento/braintree_payment'
         *   })
         * );
         */
        checkoutPagePaymentTypes: new targets.types.Sync([
            'checkoutPagePaymentTypes'
        ]),

        /**
         * Provides access to Venia's saved payment methods
         *
         * This target lets you add new saved payment method to your storefronts.
         *
         * @member {tapable.SyncHook}
         *
         * @see [Intercept function signature]{@link savedPaymentInterceptFunction}
         * @see [SavedPaymentTypes]{@link #SavedPaymentTypesDefinition}
         * @see [SavedPayment definition object]{@link SavedPaymentDefinition}
         *
         * @example <caption>Add a payment</caption>
         * targets.of('@magento/venia-ui').savedPaymentTypes.tap(
         *   savedPaymentTypes => savedPaymentTypes.add({
         *     paymentCode: 'braintree',
         *     importPath: '@magento/braintree_payment'
         *   })
         * );
         */
        savedPaymentTypes: new targets.types.Sync(['savedPaymentTypes']),

        /**
         * Provides access to Venia's editable payment methods
         *
         * This target lets you add new editable payment method to your storefronts.
         *
         * @member {tapable.SyncHook}
         *
         * @see [Intercept function signature]{@link editablePaymentInterceptFunction}
         * @see [EditablePaymentTypes]{@link #EditabledPaymentTypesDefinition}
         * @see [EditablePayment definition object]{@link EditablePaymentDefinition}
         *
         * @example <caption>Add a payment</caption>
         * targets.of('@magento/venia-ui').editablePaymentTypes.tap(
         *   editablePaymentTypes => editablePaymentTypes.add({
         *     paymentCode: 'braintree',
         *     importPath: '@magento/braintree_payment'
         *   })
         * );
         */
        editablePaymentTypes: new targets.types.Sync(['editablePaymentTypes']),

        /**
         * Provides access to Venia's summary page for a payment method.
         *
         * This target allows you to add custom payment summary rendering for the summary page in the checkout.
         *
         * @member {tapable.SyncHook}
         *
         * @see [Intercept function signature]{@link summaryPagePaymentTypesInterceptFunction}
         * @see [EditablePaymentTypes]{@link #SavedPaymentTypesDefinition}
         * @see [EditablePayment definition object]{@link SavedPaymentDefinition}
         *
         * @example <caption>Add a payment</caption>
         * targets.of('@magento/venia-ui').editablePaymentTypes.tap(
         *   editablePaymentTypes => editablePaymentTypes.add({
         *     paymentCode: 'braintree',
         *     importPath: '@magento/braintree_payment'
         *   })
         * );
         */
        summaryPagePaymentTypes: new targets.types.Sync([
            'summaryPagePaymentTypes'
        ]),

        categoryListProductAttributes: new targets.types.Sync([
            'categoryListProductAttributes'
        ]),

        rootShimmerTypes: new targets.types.Sync(['rootShimmerTypes'])
    });
};

/** Type definitions related to: talons */

/**
 * Intercept function signature for the `talons` and `hooks` targets.
 *
 * Interceptors of `hooks` should call `wrapWith` on the individual hooks in
 * the provided [`HookInterceptorSet` object]{@link
 * http://pwastudio.io/peregrine/reference/targets/wrappable-talons}.
 *
 * @callback hookInterceptFunction
 * @param {HookInterceptorSet} hookInterceptors Registry of wrappable hook namespaces
 */
