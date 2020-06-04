const {
    configureWebpack,
    graphQL: { getMediaURL, getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = async env => {
    const mediaUrl = await getMediaURL();

    global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const config = await configureWebpack({
        context: __dirname,
        vendor: [
            '@apollo/react-hooks',
            'apollo-cache-inmemory',
            'apollo-cache-persist',
            'apollo-client',
            'apollo-link-context',
            'apollo-link-http',
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
        env
    });

    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    config.module.noParse = [/braintree\-web\-drop\-in/];
    config.plugins = [
        ...config.plugins,
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

    return config;
};
