/**
 * @module Buildpack/WebpackTools
 */

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
            loader: 'babel-loader',
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
getModuleRules.css = async ({ mode, paths, hasFlag, transformRequests }) => {
    const styleLoader = {
        loader: 'style-loader'
    };

    const nonModuleRule = {
        include: /node_modules/,
        use: [
            styleLoader,
            {
                loader: 'css-loader',
                options: {
                    modules: false
                }
            }
        ]
    };

    const cssModuleLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: mode === 'development',
            localIdentName: '[name]-[local]-[hash:base64:3]',
            modules: true
        }
    };

    const moduleRule = {
        test: [paths.src, ...hasFlag('cssModules')],
        use: [styleLoader, cssModuleLoader]
    };

    const oneOf = [moduleRule, nonModuleRule];

    const postCssTransformedModules = new Map();
    Object.entries(transformRequests.postcss).forEach(
        ([plugin, requestsByFile]) => {
            const pluginFactory = require(plugin);
            Object.entries(requestsByFile).forEach(([filename, requests]) => {
                let pluginsForFile = postCssTransformedModules.get(filename);
                if (!pluginsForFile) {
                    pluginsForFile = [];
                    postCssTransformedModules.set(filename, pluginsForFile);
                }
                pluginsForFile.push([pluginFactory, requests]);
            });
        }
    );
    if (postCssTransformedModules.size > 0) {
        const postCssLoader = {
            loader: 'postcss-loader',
            ident: 'buildpack-postcss-loader',
            options: {
                ident: 'buildpack-postcss-loader',
                plugins: loader => {
                    const pluginsForFile =
                        postCssTransformedModules.get(loader.resourcePath) ||
                        [];
                    return pluginsForFile.map(([plugin, options]) =>
                        plugin(options)
                    );
                },
                sourceMap: mode === 'development' && 'inline'
            }
        };
        const transformedModuleRule = {
            include: [...postCssTransformedModules.keys()],
            use: [styleLoader, cssModuleLoader, postCssLoader]
        };
        oneOf.unshift(transformedModuleRule);
    }

    return {
        test: /\.css$/,
        oneOf
    };
};

/**
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns Rule object for Webpack `module` configuration which parses
 *   and inlines binary files below a certain size
 */
getModuleRules.files = async () => ({
    test: /\.(jpg|svg|png)$/,
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
