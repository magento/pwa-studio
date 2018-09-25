const { resolve } = require('path');
const setDeep = require('lodash').set;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class CriticalCssPlugin {
    constructor({
        mode,
        excludeDirs = [],
        pattern = /\.critical\.css$/,
        filename = 'critical.css',
        cssLoader = {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                localIdentName: '[name]-[local]-[hash:base64:3]',
                modules: true
            }
        }
    }) {
        this.mode = mode;
        this.excludeDirs = excludeDirs;
        this.pattern = pattern;
        this.filename = filename;
        this.cssLoader = cssLoader;
        this.extractPlugin = new MiniCssExtractPlugin({ filename });
    }
    loaders() {
        let excludeDirs;
        const defaultLoaderChain = ['style-loader', this.cssLoader];
        const extractLoaderChain = [
            MiniCssExtractPlugin.loader,
            this.cssLoader
        ];
        return {
            oneOf: [
                {
                    sideEffects: true,
                    test: this.pattern,
                    issuer: resource => {
                        if (!excludeDirs) {
                            excludeDirs = this.excludeDirs.map(dir =>
                                resolve(this.compiler.context, dir)
                            );
                        }
                        return excludeDirs.every(
                            dir => !resource.startsWith(dir)
                        );
                    },
                    use:
                        this.mode === 'development'
                            ? defaultLoaderChain
                            : extractLoaderChain
                },
                {
                    test: /\.css$/,
                    use: defaultLoaderChain
                }
            ]
        };
    }
    apply(compiler) {
        this.compiler = compiler;
        compiler.options.optimization = compiler.options.optimization || {};
        const { optimization } = compiler.options;
        if (this.mode === 'production' && !process.env.DEBUG_BEAUTIFY) {
            optimization.minimizer = optimization.minimizer || [];
            optimization.minimizer.push(
                new OptimizeCssAssetsPlugin({
                    assetNameRegExp: this.pattern,
                    cssProcessor: require('cssnano'),
                    cssProcessorPluginOptions: {
                        preset: [
                            'default',
                            { discardComments: { removeAll: true } }
                        ]
                    },
                    canPrint: true
                })
            );
        }
        setDeep(optimization, 'splitChunks.cacheGroups.critical', {
            name: 'critical',
            test: this.pattern,
            chunks: 'all',
            enforce: true,
            priority: 1000
        });
        this.extractPlugin.apply(compiler);
    }
}

module.exports = CriticalCssPlugin;
