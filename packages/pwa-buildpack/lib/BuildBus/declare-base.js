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
 */
const { SOURCE_SEP } = require('./Target');
module.exports = targets => {
    /**
     * @exports BuiltinTargets
     */
    const builtins = {
        /**
         * Collects the definitions and documentation for project-wide configuration
         * values based on the `envVarDefinitions.json` file.
         *
         * The environment variable schema object from this file is extensible
         * using an [envVarDefinitions intercept function]{@link envVarDefinitionsIntercept}.
         *
         * Intercept this target in your project to integrate your extension configuration
         * with the project-wide environment variable system.
         *
         * 
         * @see [envVarDefinitions topic]{@link http://pwastudio.io/pwa-buildpack/reference/environment-variables/}
         * 
         * @member {tapable.SyncHook}
         *
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
         * Collects requests to intercept and modify individual files from this
         * dependency.
         *
         * Since the storefront developer is in charge of important dependencies, 
         * the interceptor files in the storefront project itself should be able to
         * transform ANY file from ANY dependency.
         * However, interceptor files in the storefront dependencies are prevented
         * from modifying files from other dependencies.
         * 
         * NOTE: This is a very low-level extension point. It should be used as a
         * building block for higher-level extensions that expose functional
         * areas rather than files on disk.
         *
         * @see [transformModules intercept function]{@link transformModulesIntercept}
         *
         * @member {tapable.SyncHook}
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
         *
         * Calls interceptors whenever a Webpack Compiler object is created.
         * This almost always happens once per build, even in dev mode.
         * 
         * Use an [intercept function]{@link webpackCompilerIntercept} on this target
         * to access the [webpack compiler]{@link https://webpack.js.org/api/compiler-hooks/}.
         *
         * @member {tapable.SyncHook}
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
         * Collects flags for special build features that dependency packages
         * want to use.
         *
         * If your extension uses ES Modules instead of CommonJS in
         * its frontend code (as most should), Webpack will not parse and build
         * the modules by default. It will expect extension code to be CommonJS
         * style and will not process the ES Modules.
         * Likewise, if your extension uses CSS Modules, you must add the `cssModules` flag using this target.
         * Use a [specialFeatures intercept function]{@link specialFeaturesIntercept} 
         * to add special build features for the modules used in your project.
         *
         * @see [Special flags in `configureWebpack()`]{@link http://pwastudio.io/pwa-buildpack/reference/configure-webpack/#special-flags}
         *
         * @member {tapable.SyncHook}
         * 
         * @example <caption>Declare that your extension contains CSS modules.</caption>
         * targets.of('@magento/pwa-buildpack').specialFeatures.tap(featuresByModule => {
         *   featuresByModule['my-module'] = { cssModules: true };
         * })
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
     *
     */
    builtins.transformModules.intercept({
        /**
         * With the "register" meta-interceptor, we can mess with the arguments
         * that subsequent interceptors receive.
         *
         * @ignore
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

/** Type definitions related to: envVarDefinitions */

/**
 * Passed as the first parameter to interceptors of the `envVarDefinitions` object.
 * 
 * Interceptors of `envVarDefinitions` may mutate the definitions object.
 * These functions do not need to return a value.
 *
 * @see [EnvVarDefinitions]{@link http://pwastudio.io/pwa-buildpack/reference/environment-variables/definitions-api/#envvardefinitions--object}
 *
 * @callback envVarDefinitionsIntercept
 * @param {EnvVarDefinitions} defs - The definitions object
 */

/** Type definitions related to: transformModules */

/**
 * Intercept function signature for the transformModules target.
 *
 * Interceptors of `transformModules` should call the [`addTransform()`]{@link addTransform}
 * callback to add module specific transformers.
 * Any returned value will be ignored.
 *
 * @callback transformModulesIntercept
 * @param {addTransform} addTransform - Callback to add a transform.
 */

/**
 * Callback to add a transform.
 * 
 * @see [TransformRequest]{@link https://pwastudio.io/pwa-buildpack/reference/moduletransformconfig/#buildpackwebpacktoolstransformrequest--object}
 * 
 * @callback addTransform
 * @param {Buildpack/WebpackTools~TransformRequest} transformRequest -
 *   [Request]{@link https://pwastudio.io/pwa-buildpack/reference/moduletransformconfig/#buildpackwebpacktoolstransformrequest--object}
 * to apply a transform to a file provided by this dependency.
 */

/** Type definitions related to: webpackCompiler */

/**
 * Intercept function signature for the webpackCompiler target.
 * 
 * Interceptors of `webpackCompiler` should tap hooks on the provided
 * `compiler` object. Any returned value will be ignored.
 * 
 * @callback webpackCompilerIntercept
 * @param {webpack.Compiler} compiler - The [webpack compiler]{@link https://webpack.js.org/api/compiler-hooks/} instance
 */

/** Type definitions related to: specialFeatures */

/**
 * Intercept function signature for the specialFeatures target.
 * 
 * Interceptors of the `specialFeatures` target can use the mapping object provided
 * to map special build flags to their project modules.
 *
 * @callback specialFeaturesIntercept
 * @param {Object.<string, SpecialBuildFlags>} featuresByModule -
 * An object mapping of module names to their special build flags
 */
