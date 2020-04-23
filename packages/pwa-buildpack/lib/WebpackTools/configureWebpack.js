const { promisify } = require('util');
const stat = promisify(require('fs').stat);
const path = require('path');
const pkgDir = require('pkg-dir');

const loadEnvironment = require('../Utilities/loadEnvironment');
const getClientConfig = require('../Utilities/getClientConfig');
const getServiceWorkerConfig = require('../Utilities/getServiceWorkerConfig');
const MagentoResolver = require('../WebpackTools/MagentoResolver');
const BuildBus = require('../BuildBus');
const BuildBusPlugin = require('./plugins/BuildBusPlugin');

/**
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

async function checkForBabelConfig(appRoot) {
    try {
        await stat(path.resolve(appRoot, 'babel.config.js'));
        return true;
    } catch (e) {
        return false;
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

async function configureWebpack(options) {
    const { context } = options;

    await validateRoot(context);

    let stats;
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

    const babelConfigPresent = await checkForBabelConfig(context);

    const projectConfig = loadEnvironment(context);
    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const paths = {
        src: path.resolve(context, 'src'),
        output: path.resolve(context, 'dist')
    };

    const isEE = projectConfig.env.MAGENTO_BACKEND_EDITION === 'EE';

    const resolverOpts = {
        paths: {
            root: context,
            isEE
        }
    };
    if (options.alias) {
        resolverOpts.alias = { ...options.alias };
    }

    const magentoResolver = new MagentoResolver(resolverOpts);

    const special = options.special || {};
    bus.getTargetsOf('@magento/pwa-buildpack').specialFeatures.call(special);

    // Resolve every module listed in the `special` object into an absolute
    // filesystem path. Will be used as a test for the loader rules for each
    // of these feature flags.
    const features = await Promise.all(
        Object.entries(special).map(async ([packageName, flags]) => [
            packageName,
            await pkgDir(
                path.dirname(await magentoResolver.resolve(packageName))
            ),
            flags
        ])
    );

    const hasFlag = flag =>
        features.reduce(
            (hasIt, [, packagePath, flags]) =>
                flags[flag] ? [...hasIt, packagePath] : hasIt,
            []
        );

    const mode = getMode(options.env, projectConfig);
    const configOptions = {
        mode,
        context,
        babelConfigPresent,
        paths,
        hasFlag,
        projectConfig,
        resolve: magentoResolver.config,
        stats
    };

    const serviceWorkerConfig = getServiceWorkerConfig(configOptions);

    const clientConfig = await getClientConfig({
        ...configOptions,
        vendor: options.vendor || []
    });

    clientConfig.plugins.unshift(new BuildBusPlugin(bus, busTrackingQueue));

    return { clientConfig, serviceWorkerConfig };
}

module.exports = configureWebpack;
