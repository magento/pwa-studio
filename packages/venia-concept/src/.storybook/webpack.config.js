const path = require('path');
const {
    graphQL: { getPossibleTypes, getStoreConfigData },
    Utilities: { loadEnvironment }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('../../webpack.config');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// Storybook 5.2.8 uses a different signature for webpack config than webpack
// defines in the docs.
// See https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode
module.exports = async ({ config: storybookBaseConfig, mode }) => {
    const projectConfig = loadEnvironment(
        // Load .env from root
        path.resolve(__dirname, '../..')
    );

    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const possibleTypes = await getPossibleTypes();
    const storeConfigData = await getStoreConfigData();
    global.LOCALE = storeConfigData.locale.replace('_', '-');

    const webpackConfig = await baseWebpackConfig(mode);

    storybookBaseConfig.module = webpackConfig.module;
    storybookBaseConfig.resolve = webpackConfig.resolve;

    // Make sure to provide any plugins that UI code may depend on.
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
        new DefinePlugin({
            POSSIBLE_TYPES: JSON.stringify(possibleTypes),
            STORE_NAME: JSON.stringify('Storybook'),
            STORE_VIEW_LOCALE: JSON.stringify(global.LOCALE),
            STORE_VIEW_CODE: process.env.STORE_VIEW_CODE
                ? JSON.stringify(process.env.STORE_VIEW_CODE)
                : JSON.stringify(storeConfigData.code)
        }),
        new EnvironmentPlugin(projectConfig.env),
        new ReactRefreshWebpackPlugin()
    ];

    return storybookBaseConfig;
};
