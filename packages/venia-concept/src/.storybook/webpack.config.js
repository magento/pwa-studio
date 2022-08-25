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

// Storybook 5.2.8 uses a different signature for webpack config than webpack
// defines in the docs.
// See https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode
module.exports = async ({ config: storybookBaseConfig, mode }) => {
    const projectConfig = await loadEnvironment(
        // Load .env from root
        path.resolve(__dirname, '../..')
    );

    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const possibleTypes = await getPossibleTypes();
    const storeConfigData = await getStoreConfigData();
    const { availableStores } = await getAvailableStoresConfigData();
    global.LOCALE = storeConfigData.locale.replace('_', '-');

    const [webpackConfig] = await baseWebpackConfig(mode);

    storybookBaseConfig.module = webpackConfig.module;
    storybookBaseConfig.resolve = webpackConfig.resolve;

    // Make sure to provide any plugins that UI code may depend on.
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
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

    return storybookBaseConfig;
};
