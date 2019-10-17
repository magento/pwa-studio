const { promisify } = require('util');
const stat = promisify(require('fs').stat);
const path = require('path');

const loadEnvironment = require('../../Utilities/loadEnvironment');
const getClientConfig = require('./getClientConfig');
const getServiceWorkerConfig = require('./getServiceWorkerConfig');
const getIncludeFeatures = require('./getIncludeFeatures');

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
            'Must provide the root directory of the PWA as the first parameter to `configureWebpack()`. In webpack.config.js, the recommended code is `configureWebpack(__dirname)`.'
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

function getMode(cliEnv = {}, projectConfig) {
    if (cliEnv.mode) {
        return cliEnv.mode;
    }
    if (projectConfig.isProd) {
        return 'production';
    }
    return 'development';
}

async function checkForBabelConfig(appRoot) {
    try {
        await stat(path.resolve(appRoot, 'babel.config.js'));
        return true;
    } catch (e) {
        return false;
    }
}

async function getESModuleRule({ context, mode, paths, packagesFeaturing }) {
    const babelConfigPresent = await checkForBabelConfig(context);
    return {
        test: /\.(mjs|js)$/,
        include: [paths.src, ...packagesFeaturing('esModules')],
        sideEffects: false,
        use: [
            {
                loader: 'babel-loader',
                options: {
                    envName: mode,
                    rootMode: babelConfigPresent ? 'root' : 'upward'
                }
            }
        ]
    };
}

async function configureWebpack({ context, vendor = [], special = {}, env }) {
    await validateRoot(context);

    const projectConfig = loadEnvironment(context);

    const options = {
        context,
        special,
        vendor
    };

    options.mode = getMode(env, projectConfig);

    options.paths = {
        src: path.resolve(context, 'src'),
        output: path.resolve(context, 'dist')
    };

    options.packagesFeaturing = await getIncludeFeatures(options, require);

    options.esModuleRule = await getESModuleRule(options);

    const serviceWorkerConfig = getServiceWorkerConfig({
        ...options,
        ...projectConfig.section('serviceWorker')
    });

    const clientConfig = await getClientConfig(
        {
            ...options,
            ...projectConfig.sections(
                'customOrigin',
                'devServer',
                'imageService',
                'magento',
                'upwardJs'
            ),
            fullEnv: projectConfig.env
        },
        process
    );

    return { clientConfig, serviceWorkerConfig };
}

module.exports = configureWebpack;
