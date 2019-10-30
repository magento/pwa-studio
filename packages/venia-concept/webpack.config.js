const { graphQL: { getUnionAndInterfaceTypes }} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/pwa-buildpack/base.webpack.config');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = async env => {
    const { clientConfig, serviceWorkerConfig } = await baseWebpackConfig(env, __dirname);

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    clientConfig.module.noParse = [/braintree\-web\-drop\-in/];
    clientConfig.plugins = [
        ...clientConfig.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('Venia')
        }),
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ];

    return [clientConfig, serviceWorkerConfig];
};
