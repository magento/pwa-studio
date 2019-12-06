const path = require('path');
const {
    graphQL: { getUnionAndInterfaceTypes },
    Utilities: { loadEnvironment }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/venia-concept/webpack.config');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');

module.exports = async ({ config: storybookBaseConfig }) => {
    // The .env for running most of this project comes from venia-concept.
    // This is not resilient and will need to change if venia-concept is renamed.
    const projectConfig = loadEnvironment(
        path.resolve(__dirname, '../../venia-concept')
    );

    if (projectConfig.error) {
        throw projectConfig.error;
    }

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const [webpackConfig] = await baseWebpackConfig(storybookBaseConfig.mode);

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
