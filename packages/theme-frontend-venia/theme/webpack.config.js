const webpack = require('webpack');
const { resolve } = require('path');
const UglifyPlugin = require('uglifyjs-webpack-plugin');
const configureBabel = require('./babel.config.js');

const dirRoot = resolve(__dirname);
const dirSource = resolve(dirRoot, 'src');
const dirOutput = resolve(
    dirRoot,
    '../../../../../pub/static/frontend/Magento/rush/en_US/bundles'
);

const libs = [
    'react',
    'react-dom',
    'react-redux',
    'react-router-dom',
    'redux',
    'redux-actions'
];

module.exports = env => {
    const environment = [].concat(env);
    const babelOptions = configureBabel(environment);
    const isProd = environment.includes('production');

    console.log(`Environment: ${environment}`);

    // create the default config for development-like environments
    const config = {
        context: dirSource,
        entry: {
            client: resolve(dirSource, 'index.js')
        },
        output: {
            path: dirOutput,
            publicPath: '/',
            filename: '[name].js',
            chunkFilename: '[chunkhash].js'
        },
        module: {
            rules: [
                {
                    exclude: /node_modules/,
                    test: /\.js$/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: babelOptions
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 1
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            modules: [dirRoot, 'node_modules'],
            mainFiles: ['index'],
            extensions: ['.js']
        },
        plugins: [
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.EnvironmentPlugin({
                NODE_ENV: isProd ? 'production' : 'development'
            })
        ],
        devServer: {
            contentBase: false,
            port: 8080,
            publicPath: '/'
        },
        devtool: 'source-map'
    };

    // modify the default config for production-like environments
    if (isProd) {
        // disable sourcemaps
        delete config.devtool;

        // add a second entry point for third-party runtime dependencies
        config.entry.vendor = libs;

        // add the CommonsChunk plugin to generate more than one bundle
        config.plugins.push(
            new webpack.optimize.CommonsChunkPlugin({
                names: ['vendor']
            })
        );

        // add the UglifyJS plugin to minify the bundle and eliminate dead code
        config.plugins.push(new UglifyPlugin());
    }

    return config;
};
