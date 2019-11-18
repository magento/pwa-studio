const {
    graphQL: { getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/venia-concept/webpack.config');
const { DefinePlugin } = require('webpack');
const backendUrl = require('./backendUrl');

module.exports = async ({ config: storybookBaseConfig, mode }) => {
    process.env.MAGENTO_BACKEND_URL = backendUrl;

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
        })
    ];

    storybookBaseConfig.resolve = webpackConfig.resolve;

    return storybookBaseConfig;
};
