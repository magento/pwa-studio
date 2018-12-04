const webpack = require('webpack');
const path = require("path");

const base_config  = require('../webpack.config.js')

const themePaths = {
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../web'),
    output: path.resolve(__dirname, '../web/js'),
    node: path.resolve(__dirname, '../../../'),
    root: path.resolve(__dirname, '../')

};

const {
    WebpackTools: {
        makeMagentoRootComponentsPlugin,
        MagentoResolver
    }
} = require('@magento/pwa-buildpack');

const rootComponentsDirs = ['./src/RootComponents/'];

module.exports = async (storybookBaseConfig, configType) => {

    const conf = await base_config();

    storybookBaseConfig.resolve = await MagentoResolver.configure({
        paths: {
            root: themePaths.root
        }
    });

    storybookBaseConfig.module.rules = conf.module.rules;

    storybookBaseConfig.plugins = [await makeMagentoRootComponentsPlugin({
        rootComponentsDirs,
        context: themePaths.root
    })
    ]

    return storybookBaseConfig;
};
