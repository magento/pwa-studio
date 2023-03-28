const { configureWebpack, graphQL } = require('@magento/pwa-buildpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackSkipAssetsPlugin = require('html-webpack-skip-assets-plugin')
    .HtmlWebpackSkipAssetsPlugin;
const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const {
    isDevServer,
    isBundleAnalyzer
} = require('@magento/pwa-buildpack/lib/util/process');
const WebpackBeforeBuildPlugin = require('before-build-webpack');

const {
    getMediaURL,
    getStoreConfigData,
    getAvailableStoresConfigData,
    getPossibleTypes
} = graphQL;

const { DefinePlugin } = webpack;

const getCleanTemplate = templateFile => {
    return new Promise(resolve => {
        fs.readFile(templateFile, 'utf8', (err, data) => {
            resolve(
                data.replace(
                    /(?<inlineddata><!-- Inlined Data -->.*\s<!-- \/Inlined Data -->)/gs,
                    ''
                )
            );
        });
    });
};

// Todo: support watch mode with SSR.
const config = async env => {
    const ssr = process.env.SSR_ENABLED !== 'false' && !isDevServer();

    const clientConfig = await getConfig('web', ssr)(env);

    if (ssr && !isBundleAnalyzer()) {
        const serverConfig = await getConfig('node')(env);

        // Wait until the web bundle has been finished
        serverConfig.plugins.push(
            new WaitPlugin(
                path.resolve(clientConfig.output.path, './loadable-stats.json')
            )
        );
        clientConfig.cache = false;

        return [clientConfig, serverConfig];
    } else {
        return [clientConfig];
    }
};

/**
 *
 * @param {"web"|"node"} target
 * @param {boolean} ssr
 * @returns {function}
 */
function getConfig(target, ssr = true) {
    return async env => {
        /**
         * configureWebpack() returns a regular Webpack configuration object.
         * You can customize the build by mutating the object here, as in
         * this example. Since it's a regular Webpack configuration, the object
         * supports the `module.noParse` option in Webpack, documented here:
         * https://webpack.js.org/configuration/module/#modulenoparse
         */
        const config = await configureWebpack({
            context: __dirname,
            target,
            vendor: [
                '@apollo/client',
                'apollo-cache-persist',
                'informed',
                'react',
                'react-dom',
                'react-feather',
                'react-redux',
                'react-router-dom',
                'redux',
                'redux-actions',
                'redux-thunk'
            ],
            special: {
                'react-feather': {
                    esModules: true
                }
            },
            env,
            ssr
        });

        const mediaUrl = await getMediaURL();
        const storeConfigData = await getStoreConfigData();
        const { availableStores } = await getAvailableStoresConfigData();
        const writeFile = promisify(fs.writeFile);

        /**
         * Loop the available stores when there is provided STORE_VIEW_CODE
         * in the .env file, because should set the store name from the
         * given store code instead of the default one.
         */
        const availableStore = availableStores.find(
            ({ store_code }) => store_code === process.env.STORE_VIEW_CODE
        );

        global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;
        global.LOCALE = storeConfigData.locale.replace('_', '-');
        global.AVAILABLE_STORE_VIEWS = availableStores;

        const possibleTypes = await getPossibleTypes();

        config.module.noParse = [
            /@adobe\/adobe\-client\-data\-layer/,
            /braintree\-web\-drop\-in/
        ];
        config.plugins = [
            ...config.plugins,
            new DefinePlugin({
                /**
                 * Make sure to add the same constants to
                 * the globals object in jest.config.js.
                 */
                POSSIBLE_TYPES: JSON.stringify(possibleTypes),
                STORE_NAME: availableStore
                    ? JSON.stringify(availableStore.store_name)
                    : JSON.stringify(storeConfigData.store_name),
                STORE_VIEW_CODE: process.env.STORE_VIEW_CODE
                    ? JSON.stringify(process.env.STORE_VIEW_CODE)
                    : JSON.stringify(storeConfigData.code),
                AVAILABLE_STORE_VIEWS: JSON.stringify(availableStores),
                DEFAULT_LOCALE: JSON.stringify(global.LOCALE),
                DEFAULT_COUNTRY_CODE: JSON.stringify(
                    process.env.DEFAULT_COUNTRY_CODE || 'US'
                ),
                __DEV__: process.env.NODE_ENV !== 'production',
                IS_BROWSER: JSON.stringify(target !== 'node'),
                IS_SERVER: JSON.stringify(target === 'node'),
                SSR_ENABLED: ssr
            })
        ];

        if (target === 'web') {
            const htmlWebpackConfig = {
                filename: 'index.html',
                minify: {
                    collapseWhitespace: true,
                    removeComments: true
                }
            };

            // Strip UPWARD mustache from template file during watch
            if (
                process.env.npm_lifecycle_event &&
                process.env.npm_lifecycle_event.includes('watch')
            ) {
                const devTemplate = await getCleanTemplate('./template.html');

                // Generate new gitignored html file based on the cleaned template
                await writeFile('template.generated.html', devTemplate);
                htmlWebpackConfig.template = './template.generated.html';
            } else {
                htmlWebpackConfig.template = './template.html';
            }

            config.plugins.push(new HTMLWebpackPlugin(htmlWebpackConfig));

            if (ssr) {
                // Exclude bundle assets from the HTML because it's inserted runtime by the SSR Middleware
                config.plugins.push(
                    new HtmlWebpackSkipAssetsPlugin({
                        skipAssets: [
                            /(client|vendors|runtime)(\..*)?\.js/,
                            /client(\..*)?\.css/
                        ]
                    })
                );
            }
        }

        return config;
    };
}

class WaitPlugin extends WebpackBeforeBuildPlugin {
    constructor(file, interval = 100, timeout = 120000) {
        super(function(stats, callback) {
            const start = Date.now();

            function poll() {
                if (fs.existsSync(file)) {
                    callback();
                } else if (Date.now() - start > timeout) {
                    throw Error("Maybe it just wasn't meant to be.");
                } else {
                    setTimeout(poll, interval);
                }
            }

            poll();
        });
    }
}

module.exports = config;
