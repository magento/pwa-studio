/**
 * @module Buildpack/WebpackTools
 */
const path = require('path');

/**
 * Create a Webpack
 * [module rules object](https://webpack.js.org/configuration/module/#rule) for
 * processing all the filetypes that the project will contain.
 *
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns {Object[]} Array of Webpack rules.
 */
async function getModuleRules(helper) {
    return Promise.all([
        getModuleRules.graphql(helper),
        getModuleRules.js(helper),
        getModuleRules.css(helper),
        getModuleRules.files(helper)
    ]);
}

/**
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns Rule object for Webpack `module` configuration which parses
 *   `.graphql` files
 */
getModuleRules.graphql = async ({ paths, hasFlag }) => ({
    test: /\.graphql$/,
    include: [paths.src, ...hasFlag('graphqlQueries')],
    use: [
        {
            loader: 'graphql-tag/loader'
        }
    ]
});

/**
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns Rule object for Webpack `module` configuration which parses
 *   JavaScript files
 */
getModuleRules.js = async ({
    mode,
    paths,
    hasFlag,
    babelRootMode,
    transformRequests
}) => {
    const overrides = Object.entries(transformRequests.babel).map(
        ([plugin, requestsByFile]) => ({
            test: Object.keys(requestsByFile),
            plugins: [[plugin, { requestsByFile }]]
        })
    );

    const astLoaders = [
        {
            // Use custom loader to enable warning reporting from Babel plugins
            loader: path.resolve(
                __dirname,
                '../loaders/buildbus-babel-loader.js'
            ),
            options: {
                sourceMaps: mode === 'development' && 'inline',
                envName: mode,
                root: paths.root,
                rootMode: babelRootMode,
                overrides
            }
        }
    ];

    const sourceLoaders = Object.entries(transformRequests.source).map(
        ([loader, requestsByFile]) => {
            return {
                test: Object.keys(requestsByFile),
                use: [
                    info => ({
                        loader,
                        options: requestsByFile[info.realResource].map(
                            req => req.options
                        )
                    })
                ]
            };
        }
    );

    return {
        test: /\.(mjs|js|jsx)$/,
        include: [paths.src, ...hasFlag('esModules')],
        sideEffects: false,
        rules: [...astLoaders, ...sourceLoaders]
    };
};

/**
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns Rule object for Webpack `module` configuration which parses
 *   CSS files
 */
getModuleRules.css = async ({ hasFlag, mode, paths }) => ({
    test: /\.css$/,
    oneOf: [
        {
            test: [paths.src, ...hasFlag('cssModules')],
            use: [
                {
                    loader: 'style-loader',
                    options: {
                        injectType:
                            mode === 'development'
                                ? 'styleTag'
                                : 'singletonStyleTag'
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[name]-[local]-[hash:base64:3]',
                        modules: true,
                        sourceMap: mode === 'development'
                    }
                },
                'postcss-loader'
            ]
        },
        {
            include: /node_modules/,
            use: [
                {
                    loader: 'style-loader',
                    options: {
                        injectType:
                            mode === 'development'
                                ? 'styleTag'
                                : 'singletonStyleTag'
                    }
                },
                {
                    loader: 'css-loader',
                    options: {
                        modules: false
                    }
                }
            ]
        }
    ]
});

/**
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns Rule object for Webpack `module` configuration which parses
 *   and inlines binary files below a certain size
 */
getModuleRules.files = async () => ({
    test: /\.(gif|jpg|png|svg)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                name: '[name]-[hash:base58:3].[ext]'
            }
        }
    ]
});

module.exports = getModuleRules;
