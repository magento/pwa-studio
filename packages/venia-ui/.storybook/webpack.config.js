const path = require('path');
const {
    graphQL: { getPossibleTypes },
    Utilities: { loadEnvironment }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/venia-concept/webpack.config');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');

// Storybook 5.2.8 uses a different signature for webpack config than webpack
// defines in the docs.
// See https://storybook.js.org/docs/configurations/custom-webpack-config/#full-control-mode
module.exports = async ({ config: storybookBaseConfig, mode }) => {
    // The .env for running most of this project comes from venia-concept.
    // This is not resilient and will need to change if venia-concept is renamed.
    const projectConfig = loadEnvironment(
        path.resolve(__dirname, '../../venia-concept')
    );

    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const possibleTypes = await getPossibleTypes();

    const webpackConfig = await baseWebpackConfig(mode);

    storybookBaseConfig.module = webpackConfig.module;
    storybookBaseConfig.resolve = webpackConfig.resolve;

    // Make sure to provide any plugins that UI code may depend on.
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
        new DefinePlugin({
            POSSIBLE_TYPES: JSON.stringify(possibleTypes),
            STORE_NAME: JSON.stringify('Storybook')
        }),
        new EnvironmentPlugin(projectConfig.env)
    ];

    return storybookBaseConfig;
};
