const {
    graphQL: { getUnionAndInterfaceTypes }
} = require('@magento/pwa-buildpack');
const baseWebpackConfig = require('@magento/pwa-buildpack/base.webpack.config');
const { DefinePlugin } = require('webpack');
const backendUrl = require('./backendUrl');

module.exports = async (storybookBaseConfig, mode, env) => {
    process.env.MAGENTO_BACKEND_URL = backendUrl;

    const { clientConfig } = await baseWebpackConfig(env, `${__dirname}/..`);
    const unionAndInterfaceTypes = await getUnionAndInterfaceTypes();

    storybookBaseConfig.module = clientConfig.module;
    storybookBaseConfig.resolve = clientConfig.resolve;
    storybookBaseConfig.plugins = [
        ...storybookBaseConfig.plugins,
        new DefinePlugin({
            UNION_AND_INTERFACE_TYPES: JSON.stringify(unionAndInterfaceTypes)
        })
    ];
    return storybookBaseConfig;
};
