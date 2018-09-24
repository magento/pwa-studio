const setDeep = require('lodash').set;
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

class CriticalCssPlugin {
    constructor({
        mode,
        pattern = /\.critical\.css/,
        filename = '[name].critical.css',
        cssLoader = {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                // localIdentName: '[name]-[local]-[hash:base64:3]',
                modules: true
            }
        },
        nonCriticalPattern = /\.css$/
    }) {
        this.mode = mode;
        this.pattern = pattern;
        this.filename = filename;
        this.cssLoader = cssLoader;
        this.nonCriticalPattern = nonCriticalPattern;
        this.extractPlugin = new MiniCssExtractPlugin({ filename });
        this.optimizePlugin = new OptimizeCssAssetsPlugin({
            assetNameRegExp: this.pattern,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
            },
            canPrint: true
        });
    }
    load() {
        const defaultLoaderChain = ['style-loader', this.cssLoader];
        const extractLoaderChain = [
            MiniCssExtractPlugin.loader,
            this.cssLoader
        ];
        return {
            oneOf: [
                {
                    test: this.pattern,
                    use:
                        this.mode === 'development'
                            ? defaultLoaderChain
                            : extractLoaderChain
                },
                {
                    test: this.nonCriticalPattern,
                    use: defaultLoaderChain
                }
            ]
        };
    }
    apply(compiler) {
        compiler.options.optimization = compiler.options.optimization || {};
        const { optimization } = compiler.options;
        optimization.minimizer = optimization.minimizer || [];
        optimization.minimizer.push(this.optimizePlugin);
        setDeep(optimization, 'splitChunks.cacheGroups.styles', {
            name: 'critical',
            test: this.pattern,
            chunks: 'all',
            enforce: true
        });
        this.extractPlugin.apply(compiler);
    }
}

module.exports = CriticalCssPlugin;
