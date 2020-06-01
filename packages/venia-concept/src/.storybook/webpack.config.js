const path = require('path');
const {
    graphQL: { getUnionAndInterfaceTypes },
    Utilities: { loadEnvironment }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('../../webpack.config');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');

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

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const webpackConfig = await baseWebpackConfig(mode);

    storybookBaseConfig.module = webpackConfig.module;
    storybookBaseConfig.resolve = webpackConfig.resolve;

    // Make sure to provide any plugins that UI code may depend on.
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
        new DefinePlugin({
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes),
            STORE_NAME: JSON.stringify('Storybook')
        }),
        new EnvironmentPlugin(projectConfig.env)
    ];

    return storybookBaseConfig;
};
