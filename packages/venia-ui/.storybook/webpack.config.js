const {
    graphQL: { getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/venia-concept/webpack.config');
const { DefinePlugin, EnvironmentPlugin } = require('webpack');
const { getEnvironmentVariable } = require('./getEnvironmentVariable');

module.exports = async ({ config: storybookBaseConfig, mode }) => {
    process.env.MAGENTO_BACKEND_URL = getEnvironmentVariable(
        'MAGENTO_BACKEND_URL'
    );
    process.env.CHECKOUT_BRAINTREE_TOKEN = getEnvironmentVariable(
        'CHECKOUT_BRAINTREE_TOKEN'
    );

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    const [webpackConfig] = await baseWebpackConfig(mode);

    storybookBaseConfig.module = webpackConfig.module;

    if (!storybookBaseConfig.plugins) {
        storybookBaseConfig.plugins = [];
    }
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
        new DefinePlugin({
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes)
        }),
        // Pass the Braintree token to the storybook app environment.
        new EnvironmentPlugin(['CHECKOUT_BRAINTREE_TOKEN'])
    ];

    storybookBaseConfig.resolve = webpackConfig.resolve;

    return storybookBaseConfig;
};
