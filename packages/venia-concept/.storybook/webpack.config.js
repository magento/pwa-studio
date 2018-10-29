const path = require('path');

const configureBabel = require('../babel.config.js');
const babelOptions = configureBabel('development');
console.log(babelOptions);

const base_config = require('./webpack.config.js');

const themePaths = {
    src: path.resolve(__dirname, '../src'),
    assets: path.resolve(__dirname, '../web'),
    output: path.resolve(__dirname, '../web/js'),
    node: path.resolve(__dirname, '../../../')
};

console.log(themePaths.node);

const testPath = path.resolve('../');

module.exports = (storybookBaseConfig, configType) => {
    storybookBaseConfig.module.rules.push({
        include: [themePaths.src],
        test: /\.js$/,
        use: [
            {
                loader: 'babel-loader',
                options: { ...babelOptions, cacheDirectory: true }
            }
        ]
    });

    storybookBaseConfig.module.rules.push({
        test: /\.css$/,
        use: [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    localIdentName: '[name]-[local]-[hash:base64:3]',
                    modules: true
                }
            }
        ]
    });

    storybookBaseConfig.module.rules.push({
        test: /\.(jpg|svg)$/,
        use: [
            {
                loader: 'file-loader',
                options: {}
            }
        ]
    });

    storybookBaseConfig.resolve.alias = {
        src: themePaths.src
    };
    storybookBaseConfig.resolve.modules = ['node_modules'];

    return storybookBaseConfig;
};
