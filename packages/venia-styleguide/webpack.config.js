const { resolve } = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = () => ({
    mode: 'development',
    context: resolve(__dirname),
    entry: './src/index.js',
    output: {
        path: resolve(__dirname),
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            rootMode: 'upward'
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                include: resolve(__dirname, 'src'),
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            localIdentName: '[name]-[local]-[hash:base64:3]',
                            modules: true
                        }
                    }
                ]
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            rootMode: 'upward'
                        }
                    },
                    '@mdx-js/loader'
                ]
            },
            {
                test: /\.yml$/,
                include: resolve(__dirname, 'src'),
                use: ['json-loader', resolve(__dirname, 'js-yaml-loader.js')]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.md']
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
    ],
    devServer: {
        historyApiFallback: true
    }
});
