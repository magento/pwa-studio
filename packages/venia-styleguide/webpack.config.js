const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
    mode: 'development',
    entry: './src/index.js',
    output: {
        path: resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: resolve(__dirname, 'src'),
                loader: 'babel-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        new HTMLWebpackPlugin({
            filename: 'index.html',
            template: './template.html',
            inject: true,
            minify: {
                collapseWhitespace: true,
                removeComments: true
            }
        })
    ]
});
