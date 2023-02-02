/**
 * Create a Webpack configuration object customized for your project.
 * @module Buildpack/WebpackTools
 */
const { promisify } = require('util');
const stat = promisify(require('fs').stat);
const path = require('path');

const loadEnvironment = require('../../Utilities/loadEnvironment');
const getClientConfig = require('./getClientConfig');
const getModuleRules = require('./getModuleRules');
const getResolveLoader = require('./getResolveLoader');
const getSpecialFlags = require('./getSpecialFlags');
const MagentoResolver = require('../MagentoResolver');
const BuildBus = require('../../BuildBus');
const BuildBusPlugin = require('../plugins/BuildBusPlugin');
const ModuleTransformConfig = require('../ModuleTransformConfig');

/**
 * Helps convert PWA Studio Buildpack settings and project properties into
 * Webpack configuration.
 * @typedef {Object} WebpackConfigHelper
 * @property {boolean} mode - Webpack mode derived from env:
 *   'development'|'production'|'none'
 * @property {string} context - Root directory of project
 * @property {boolean} babelRootMode - Babel config search mode:
 *   'root'|'upward'|'upward-optional
 * @property {Object} paths - Relevant Webpack paths
 * @property {string} paths.root - Project root, equivalent to Webpack `context`
 * @property {string} paths.src - Source code folder, should be a subdirectory
 *   of root
 * @property {Buildpack/WebpackTools~hasSpecialFlags} hasFlag - Returns a list
 *   of real paths to modules which have set the provided flag. Use for module
 *   rules.
 * @property {Buildpack/Utilities~ProjectConfiguration} projectConfig -
 *   Configuration object for retrieving any environment variable setting for
 *   the project being built.
 * @property {MagentoResolver} resolver - Module resolver function for this
 *   build
 * @property {Object} transformRequests - Map of requests to apply loader
 *   transforms to individual modules.
 * @property {Object} transformRequests.babel - Map of individual ES modules to
 *   requests to transform them via Babel.
 * @property {Buildpack/BuildBus.BuildBus} bus - {@link BuildBus} for the currently running task.
 *   Will be used to call build-specific targets.
 */

/**
 * @ignore
 * We need a root directory for the app in order to build all paths relative to
 * that app root. It's not safe to use process.cwd() here because that depends
 * on what directory Node is run in. The project root should be the dir of the
 * webpack.config.js which called this function.
 *
 * There is no safe way to get the path of this function's caller, so instead we
 * expect that the webpack.config.js will do:
 *
 *     configureWebpack(__dirname);
 */
async function validateRoot(appRoot) {
    if (!appRoot) {
        throw new Error(
            'Must provide the root directory of the PWA as the "context" property of configureWebpack() options. `configureWebpack()`. In webpack.config.js, the recommended code is `configureWebpack({ context: __dirname })` to set the context to the exact location of webpack.config.js.'
        );
    }
    // If root doesn't exist, an ENOENT will throw here and log to stderr.
    const dirStat = await stat(appRoot);
    if (!dirStat.isDirectory()) {
        throw new Error(
            `Provided application root "${appRoot}" is not a directory.`
        );
    }
}

async function getBabelRootMode(appRoot) {
    try {
        await stat(path.resolve(appRoot, 'babel.config.js'));
        return 'root';
    } catch (e) {
        return 'upward';
    }
}

function getMode(cliEnv = {}, projectConfig) {
    if (cliEnv.mode) {
        return cliEnv.mode;
    }
    if (projectConfig.isProd) {
        return 'production';
    }
    return 'development';
}

/**
 * Create a configuration object to pass to Webpack for build. Use this in
 * the `webpack.config.js` file in your project root.
 *
 * @static
 * @returns An array of two Webpack configurations for simultaneously building the client bundles and the ServiceWorker bundle.
 */
async function configureWebpack(options) {
    const { context } = options;

    await validateRoot(context);

    let stats;
    /* istanbul ignore next: this is an internal debug mechanism for now */
    if (process.env.DEBUG && process.env.DEBUG.includes('BuildBus')) {
        BuildBus.enableTracking();
        stats = {
            logging: 'verbose',
            loggingDebug: ['BuildBusPlugin'],
            assets: false,
            chunks: false,
            chunkGroups: false,
            chunkModules: false,
            chunkOrigins: false,
            entrypoints: false,
            performance: false,
            publicPath: false,
            reasons: false,
            timings: false,
            version: false
        };
    }

    const busTrackingQueue = [];
    const bus = BuildBus.for(context);
    bus.attach('configureWebpack', (...args) => busTrackingQueue.push(args));
    bus.init();

    const babelRootMode = await getBabelRootMode(context);

    const projectConfig = await loadEnvironment(context);
    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const paths = {
        src: path.resolve(context, 'src'),
        output: path.resolve(context, 'dist')
    };

    const isAC =
        projectConfig.env.MAGENTO_BACKEND_EDITION === 'AC' ||
        projectConfig.env.MAGENTO_BACKEND_EDITION === 'EE';

    const resolverOpts = {
        isAC,
        paths: {
            root: context
        }
    };
    if (options.alias) {
        resolverOpts.alias = { ...options.alias };
    }

    const resolver = new MagentoResolver(resolverOpts);

    const hasFlag = await getSpecialFlags(options.special, bus, resolver);

    const mode = getMode(options.env, projectConfig);

    const transforms = new ModuleTransformConfig(
        resolver,
        require(path.resolve(context, 'package.json')).name
    );

    /** @typedef {import('../../BuildBus/declare-base)} BuiltinTargets */

    await bus
        .getTargetsOf('@magento/pwa-buildpack')
        .transformModules.promise(x => transforms.add(x));

    const transformRequests = await transforms.toLoaderOptions();

    const configHelper = {
        mode,
        context,
        babelRootMode,
        paths,
        hasFlag,
        projectConfig,
        resolver,
        stats,
        transformRequests,
        bus
    };

    const clientConfig = await getClientConfig({
        ...configHelper,
        vendor: options.vendor || []
    });

    const buildBusPlugin = new BuildBusPlugin(bus, busTrackingQueue);
    clientConfig.plugins.unshift(buildBusPlugin);

    return clientConfig;
}

configureWebpack.getClientConfig = getClientConfig;
configureWebpack.getModuleRules = getModuleRules;
configureWebpack.getResolveLoader = getResolveLoader;
configureWebpack.getSpecialFlags = getSpecialFlags;

module.exports = configureWebpack;
