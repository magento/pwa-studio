const webpack = require('webpack');
const { LimitChunkCountPlugin } = webpack.optimize;

const getCommonConfig = require('./webpack.config');

/**
 * Temporary location to store efforts towards a webpack config for SSR
 *
 * @param env
 * @returns {Promise<void>}
 */
module.exports = async env => {
    const [config] = await getCommonConfig(env);
    const serverConfig = Object.assign({}, config, {
        target: 'node',
        devtool: false,
        module: { ...config.module },
        name: 'server-config',
        output: {
            ...config.output,
            filename: '[name].[hash].SERVER.js',
            strictModuleExceptionHandling: true
        },
        optimization: {
            minimize: false
        },
        plugins: [...config.plugins]
    });

    // TODO: get LocalizationPlugin working in Node
    const browserPlugins = new Set()
        .add('HtmlWebpackPlugin')
        .add('LocalizationPlugin')
        .add('ServiceWorkerPlugin')
        .add('VirtualModulesPlugin')
        .add('WebpackAssetsManifest');
    //remove browser-only plugins
    serverConfig.plugins = serverConfig.plugins.filter(
        plugin => !browserPlugins.has(plugin.constructor.name)
    );

    // remove browser-only module rules
    serverConfig.module.rules = serverConfig.module.rules.map(rule => {
        if (`${rule.test}` === '/\\.css$/') {
            return {
                ...rule,
                oneOf: rule.oneOf.map(ruleConfig => ({
                    ...ruleConfig,
                    use: ruleConfig.use.filter(
                        loaderConfig => loaderConfig.loader !== 'style-loader'
                    )
                }))
            };
        }
        return rule;
    });

    // add LimitChunkCountPlugin to avoid code splitting
    serverConfig.plugins.push(
        new LimitChunkCountPlugin({
            maxChunks: 1
        })
    );
};
