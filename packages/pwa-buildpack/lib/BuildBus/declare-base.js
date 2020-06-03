/**
 * Target definitions for Buildpack.
 *
 * Since Buildpack implements the BuildBus itself, Buildpack's own targets can
 * be considered the "base targets". Most other targets will be called in
 * interceptors to other targets. However, Buildpack code has access to the
 * BuildBus instance directly, so it can and does call the below targets
 * directly in its module code using `bus.getTargetsOf`.
 *
 * @namespace {Object} BuiltinTargets
 *
 * @memberof @magento/pwa-buildpack
 *
 */
const { SOURCE_SEP } = require('./Target');
module.exports = targets => {
    /**
     * @exports BuiltinTargets
     */
    const builtins = {
        /**
         * @callback envVarIntercept
         * @param {Object} defs - The envVarDefinitions.json structure.
         * @returns {undefined} - Interceptors of `envVarDefinitions` may mutate
         *   the definitions object. Any returned value will be ignored.
         */

        /**
         * Collects definitions and documentation for project-wide configuration
         * values. The environment variable schema in `envVarDefinitions.json`
         * is extensible. Extensions are often configurable, and they can
         * integrate their configuration with the project-wide environment
         * variables system by tapping `envVarDefinitions`.
         *
         * @type {tapable.SyncHook}
         * @param {envVarIntercept} callback
         * @memberof BuiltinTargets
         * @example <caption>Add config fields for your extension</caption>
         * targets.of('@magento/pwa-buildpack').envVarDefinitions.tap(defs => {
         *   defs.sections.push({
         *     name: 'My Extension Settings',
         *     variables: [
         *       {
         *         name: 'MY_EXTENSION_API_KEY',
         *         type: 'str',
         *         desc: 'API key for remote service access.'
         *       }
         *     ]
         *   })
         * });
         *
         */
        envVarDefinitions: new targets.types.Sync(['definitions']),

        /**
         * @callback addTransform
         * @param {Buildpack/WebpackTools~TransformRequest} transformRequest -
         *   Request to apply a transform to a file provided by this dependency.
         */

        /**
         * @callback transformModuleIntercept
         * @param {addTransform} addTransform - Callback to add a transform.
         * @returns {undefined} - Interceptors of `transformModules` should call
         *   the `addTransform()` callback. Any returned value will be ignored.
         */

        /**
         * Collects requests to intercept and modify individual files from this
         * dependency. Only files from the currently requesting dependency may
         * be transformed.
         * **This is a very low-level extension point; it should be used as a
         * building block for higher-level extensions that expose functional
         * areas rather than files on disk.**
         *
         * @type {tapable.SyncHook}
         * @param {transformModuleIntercept}
         * @memberof BuiltinTargets
         *
         * @example <caption>Strip unnecessary Lodash code from a specific JS module.</caption>
         * targets.of('@magento/pwa-buildpack').transformModules.tap(addTransform => addTransform({
         *   type: 'babel',
         *   fileToTransform: './lib/uses-pipeline-syntax.js',
         *   transformModule: 'babel-plugin-lodash',
         *   options: { id: ["async", "lodash-bound" ]}
         * }));
         */
        transformModules: new targets.types.Sync(['requestTransform']),

        /**
         * @callback webpackCompilerIntercept
         * @param {webpack.Compiler} compiler - The Webpack compiler instance
         * @returns {undefined} - Interceptors of `webpackCompiler` should tap
         *   hooks on the provided `compiler` object. Any returned value will be
         *   ignored.
         */

        /**
         *
         * Calls interceptors whenever a Webpack Compiler object is created.
         * This almost always happens once per build, even in dev mode.
         *
         * @type {tapable.SyncHook}
         * @param {webpackCompilerIntercept} callback
         * @memberof BuiltinTargets
         *
         * @example <caption>Tap the compiler's `watchRun` hook.</caption>
         * targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
         *   compiler.hooks.watchRun.tapPromise(async () => {
         *      compiler.getInfrastructureLogger('my-extension')
         *        .info('I do something special in the dev server!');
         *   });
         * });
         */
        webpackCompiler: new targets.types.Sync(['compiler']),

        /**
         * @callback specialFeaturesIntercept
         * @param {Object.<string, SpecialBuildFlags>}
         * @returns {undefined} - Interceptors do no need to return.
         */

        /**
         * Collects flags for special build features that dependency packages
         * want to use. If your extension uses ES Modules instead of CommonJS in
         * its frontend code (as most should), Webpack will not parse and build
         * the modules by default; it will expect extension code to be CommonJS
         * style and will not process the ES Modules.
         *
         * @example <caption>Declare that your extension contains CSS modules.</caption>
         * targets.of('@magento/pwa-buildpack').specialFeatures.tap(special => {
         *   specialFeatures['my-module'] = { cssModules: true };
         * })
         *
         *
         * @see {configureWebpack}
         * @type {tapable.SyncHook}
         * @param {Object<(string, boolean)>} featureFlags
         * @memberof BuiltinTargets
         */
        specialFeatures: new targets.types.Sync(['special'])
    };

    /**
     * Special behavior for the `transformModules` target: interceptors should
     * only be able to transform _their own code_, for proper encapsulation and
     * compatibility. So their transform requests will provide relative paths
     * to the files to be transformed, and the requestTransforms callback will
     * enforce the module root.
     *
     * Basically, when we call `transformModules`, we need to know what
     * dependency each transform request is coming from, so we don't have to
     * trust third-party code to mind its own business.
     *
     * In order to do that, we have to have slightly different private state
     * for each invocation of an interceptor. Tapable doesn't do that by
     * default, so we use a meta-interceptor to bind every subsequently
     * registered interceptor to its own callback, bound to its own module root
     * as an extra argument. Then, we can make sure all requested files for
     * transform belong to the module doing the requesting.
     */
    builtins.transformModules.intercept({
        /**
         * With the "register" meta-interceptor, we can mess with the arguments
         * that subsequent interceptors receive.
         */
        register: tapInfo => {
            /**
             * Get the requestor module out of the module name set by Target.
             * If something has cheated and directly tapped the underlying
             * tapable, it'll just be the name they passed and might not
             * resolve to a real module.
             */
            const requestor = tapInfo.name.split(SOURCE_SEP)[0];

            // Reference to the original callback that the interceptor passed.
            const callback = tapInfo.fn;
            return {
                /**
                 * Make a new tap object with a wrapped callback function. It
                 * now calls each interceptor with a slightly different arg. We
                 * know that transformModules receives a function as its first
                 * argument. So we expect it and bind it.
                 */
                ...tapInfo,
                fn: (requestTransform, ...args) => {
                    // Ensure the request always has the right `requestor`.
                    const requestOwnModuleTransform = request =>
                        requestTransform({ ...request, requestor });
                    // yoink!
                    return callback(requestOwnModuleTransform, ...args);
                }
            };
        }
    });

    targets.declare(builtins);
};
