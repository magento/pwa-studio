const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

class CriticalCssPlugin {
    constructor({
        mode,
        pattern = /\.critical\.css/,
        filename = '[name].critical.css',
        cssLoader = {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
                localIdentName: '[name]-[local]-[hash:base64:3]',
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
        this.extractPlugin = new ExtractTextPlugin({
            filename,
            allChunks: true,
            ignoreOrder: true
        });
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
        return {
            oneOf: [
                {
                    test: this.pattern,
                    use: this.extractPlugin.extract({
                        use: this.cssLoader
                    })
                },
                {
                    test: this.nonCriticalPattern,
                    use: ['style-loader', this.cssLoader]
                }
            ]
        };
    }
    apply(compiler) {
        this.extractPlugin.apply(compiler);
        this.optimizePlugin.apply(compiler);
    }
}

module.exports = CriticalCssPlugin;
