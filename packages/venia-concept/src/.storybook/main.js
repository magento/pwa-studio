module.exports = {
    stories: [
        '../../node_modules/@magento/venia-ui/lib/**/__stories__/*.js',
        '../**/__stories__/*.js'
    ],
    addons: [],

    // Fix for Manager webpack build (Storybook UI)
    managerWebpack: async (config, options) => {
        // Add babel rule for react-draggable in manager build
        config.module.rules.push({
            test: /\.js$/,
            include: /node_modules\/react-draggable/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: ['last 2 versions', 'ie >= 11']
                                }
                            }
                        ]
                    ]
                }
            }
        });

        return config;
    },

    // Fix for Preview webpack build (Story iframe)
    webpackFinal: async (config, { configType }) => {
        // Import the existing webpack config logic
        const path = require('path');
        const {
            graphQL: {
                getPossibleTypes,
                getStoreConfigData,
                getAvailableStoresConfigData
            },
            Utilities: { loadEnvironment }
        } = require('@magento/pwa-buildpack');
        const baseWebpackConfig = require('../../webpack.config');
        const { DefinePlugin, EnvironmentPlugin } = require('webpack');
        const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

        const projectConfig = await loadEnvironment(
            path.resolve(__dirname, '../..')
        );

        if (projectConfig.error) {
            throw projectConfig.error;
        }

        const possibleTypes = await getPossibleTypes();
        const storeConfigData = await getStoreConfigData();
        const { availableStores } = await getAvailableStoresConfigData();
        global.LOCALE = storeConfigData.locale.replace('_', '-');

        const [webpackConfig] = await baseWebpackConfig(configType);

        config.module = webpackConfig.module;
        config.resolve = webpackConfig.resolve;

        // Add babel rule for react-draggable in preview build too
        config.module.rules.push({
            test: /\.js$/,
            include: /node_modules\/react-draggable/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        [
                            '@babel/preset-env',
                            {
                                targets: {
                                    browsers: ['last 2 versions', 'ie >= 11']
                                }
                            }
                        ]
                    ]
                }
            }
        });

        // Make sure to provide any plugins that UI code may depend on.
        config.plugins = [
            ...config.plugins,
            new DefinePlugin({
                __fetchLocaleData__: async () => {
                    // no-op in storybook
                },
                POSSIBLE_TYPES: JSON.stringify(possibleTypes),
                STORE_NAME: JSON.stringify('Storybook'),
                STORE_VIEW_LOCALE: JSON.stringify(global.LOCALE),
                STORE_VIEW_CODE: process.env.STORE_VIEW_CODE
                    ? JSON.stringify(process.env.STORE_VIEW_CODE)
                    : JSON.stringify(storeConfigData.code),
                AVAILABLE_STORE_VIEWS: JSON.stringify(availableStores),
                DEFAULT_LOCALE: JSON.stringify(global.LOCALE),
                DEFAULT_COUNTRY_CODE: JSON.stringify(
                    process.env.DEFAULT_COUNTRY_CODE || 'US'
                )
            }),
            new EnvironmentPlugin(projectConfig.env),
            new ReactRefreshWebpackPlugin()
        ];

        return config;
    }
};
