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
        getModuleRules.files(helper),
        getModuleRules.i18n(helper)
    ]);
}

/**
 * @param {Buildpack/WebpackTools~WebpackConfigHelper} helper
 * @returns Rule object for finding all translation files within an npm package
 *
 * Matches any file within i18n/ with a valid locale code and the .json file extension
 *  - i18n/en_US.json
 *  - i18n/fr_FR.json
 */
getModuleRules.i18n = async ({ paths, hasFlag }) => ({
    test: /i18n\/[a-z]{2}_[A-Z]{2}\.json$/,
    include: [paths.src, ...hasFlag('i18n')],
});

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
getModuleRules.css = async ({ paths, hasFlag }) => ({
    test: /\.css$/,
    oneOf: [
        {
            test: [paths.src, ...hasFlag('cssModules')],
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        localIdentName: '[name]-[local]-[hash:base64:3]',
                        modules: true
                    }
                }
            ]
        },
        {
            include: /node_modules/,
            use: [
                'style-loader',
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
