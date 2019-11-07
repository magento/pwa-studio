const {
    graphQL: { getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/venia-concept/webpack.config');
const { DefinePlugin } = require('webpack');
const backendUrl = require('./backendUrl');

module.exports = async (storybookBaseConfig, mode, env) => {
    process.env.MAGENTO_BACKEND_URL = backendUrl;

    const webpackData = await baseWebpackConfig(env);
    const conf = webpackData[0];

    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();
    storybookBaseConfig.module = conf.module;
    storybookBaseConfig.resolve = conf.resolve;
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
        new DefinePlugin({
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes)
        })
    ];

    return storybookBaseConfig;
};
