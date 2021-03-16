const {
    configureWebpack,
    graphQL: {
        getMediaURL,
        getStoreConfigData,
        getAvailableStoresConfigData,
        getPossibleTypes
    }
} = require('@magento/pwa-buildpack');
const { DefinePlugin } = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = async env => {
    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    const config = await configureWebpack({
        context: __dirname,
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
        env
    });

    const mediaUrl = await getMediaURL();
    const storeConfigData = await getStoreConfigData();
    const { availableStores } = await getAvailableStoresConfigData();

    /**
     * Loop the available stores when there is provided STORE_VIEW_CODE
     * in the .env file, because should set the store name from the
     * given store code instead of the default one.
     */
    const availableStore = availableStores.find(
        ({ code }) => code === process.env.STORE_VIEW_CODE
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
            DEFAULT_LOCALE: JSON.stringify(global.LOCALE)
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
